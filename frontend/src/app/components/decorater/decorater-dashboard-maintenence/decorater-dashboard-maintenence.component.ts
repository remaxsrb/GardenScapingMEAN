import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking } from 'src/app/models/booking';
import { User } from 'src/app/models/user';
import { BookingService } from 'src/app/services/modelServices/booking.service';
import { TimeService } from 'src/app/services/utilityServices/time.service';

@Component({
  selector: 'app-decorater-dashboard-maintenence',
  templateUrl: './decorater-dashboard-maintenence.component.html',
  styleUrls: ['./decorater-dashboard-maintenence.component.css'],
})
export class DecoraterDashboardMaintenenceComponent implements OnInit {
  constructor(
    private bookingService: BookingService,
    private timeService: TimeService,
    private fb: FormBuilder
  ) {}

  decorator: User = new User();

  minDate: Date = new Date();

  maintained_bookings: Booking[] = [];
  maintained_currentPage: number = 1;
  maintained_limit: number = 2;
  maintained_totalPages: number = -1;
  maintained_number_of_bookings: number = 0;

  acceptMaintanenceForm!: FormGroup;

  ngOnInit(): void {
    const decoratorInfo = localStorage.getItem('user');
    if (decoratorInfo) this.decorator = JSON.parse(decoratorInfo);
    this.initAcceptForm();

    this.loadDocuments();
  }

  initAcceptForm() {
    this.acceptMaintanenceForm = this.fb.group({
      _id: [''],
      lastServiceDate: [new Date(), [Validators.required]],
      decorator: this.decorator._id,
    });
  }

  loadDocuments() {
    this.bookingService
      .toMaintain(
        this.decorator._id,
        this.maintained_currentPage,
        this.maintained_limit
      )
      .subscribe((data) => {
        this.maintained_bookings = data.bookings;
        this.maintained_currentPage = data.page;
        this.maintained_number_of_bookings = data.totalDocuments;
        this.maintained_totalPages = data.totalPages;

        this.prepareData();
      });
  }

  pageChange(event: any) {
    this.maintained_currentPage = event.first / event.rows + 1;
    this.maintained_limit = event.rows;
    this.loadDocuments();
  }

  isFirstPage() {
    return this.maintained_limit === 1;
  }

  isLastPage() {
    return this.maintained_currentPage === this.maintained_totalPages;
  }

  prepareData() {
    this.maintained_bookings.forEach((booking) => {
      booking.finishDate = this.timeService.formatDateToDDMMYYYY(
        new Date(booking.finishDate)
      );
      if (booking.lastServiceDate !== null)
        booking.lastServiceDate = this.timeService.formatDateToDDMMYYYY(
          new Date(booking.lastServiceDate)
        );

        booking.garden.waterBodies = 0;
        booking.garden.layout.forEach(shape => {
          if(shape.color==="#00a7ff")
              booking.garden.waterBodies++
        });

    });

  }

  reject(index: number) {
    const data = {
      _id: this.maintained_bookings.at(index)?._id!,
    };
    const payload = JSON.stringify(data);
    this.bookingService.rejectMaintenance(payload).subscribe((data) => {
      this.loadDocuments();
    });
  }

  acceptJob(index: number) {
    this.acceptMaintanenceForm.patchValue({
      _id: this.maintained_bookings.at(index)?._id,
    });
    this.bookingService
      .maintain(this.acceptMaintanenceForm.value)
      .subscribe((data) => {
        window.location.reload();
        this.loadDocuments();
      });
  }
}
