import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { last } from 'rxjs';
import { Booking } from 'src/app/models/booking';
import { User } from 'src/app/models/user';
import { BookingService } from 'src/app/services/modelServices/booking.service';
import { TimeService } from 'src/app/services/utilityServices/time.service';

@Component({
  selector: 'app-owner-dashboard-maintenence',
  templateUrl: './owner-dashboard-maintenence.component.html',
  styleUrls: ['./owner-dashboard-maintenence.component.css'],
})
export class OwnerDashboardMaintenenceComponent implements OnInit {
  constructor(
    private bookingService: BookingService,
    private timeService: TimeService,
    private fb: FormBuilder
  ) {}

  owner = new User();

  archived_bookings: Booking[] = [];
  archivedBooking_currentPage: number = 1;
  archivedBooking_limit: number = 5;
  archivedBooking_totalPages: number = -1;
  archivedBooking_number_of_bookings: number = 0;

  maintained_bookings: Booking[] = [];
  maintained_currentPage: number = 1;
  maintained_limit: number = 5;
  maintained_totalPages: number = -1;
  maintained_number_of_bookings: number = 0;

  waterBodies: number[] = []

  ngOnInit(): void {
    const ownerInfo = localStorage.getItem('user');
    if (ownerInfo) this.owner = JSON.parse(ownerInfo);
    this.loadDocuments('archived');
    this.loadDocuments('maintained');

  }

  loadDocuments(type: 'archived' | 'maintained') {
    if (type === 'archived') {
      this.bookingService
        .getArchivedBookings(
          this.owner._id,
          this.archivedBooking_currentPage,
          this.archivedBooking_limit
        )
        .subscribe((data) => {
          this.archived_bookings = data.bookings;
          this.archivedBooking_currentPage = data.page;
          this.archivedBooking_number_of_bookings = data.totalDocuments;
          this.archivedBooking_totalPages = data.totalPages;
          this.prepareData('archived');
        });
    } else {
      this.bookingService
        .getMaintained(
          this.owner._id,
          this.maintained_currentPage,
          this.maintained_limit
        )
        .subscribe((data) => {
          this.maintained_bookings = data.bookings;
          this.maintained_currentPage = data.page;
          this.maintained_number_of_bookings = data.totalDocuments;
          this.maintained_totalPages = data.totalPages;

          this.prepareData('maintained');
        });
    }
  }

  pageChange(event: any, type: 'archived' | 'maintained') {
    if (type === 'archived') {
      this.archivedBooking_currentPage = event.first / event.rows + 1;
      this.archivedBooking_limit = event.rows;
      this.loadDocuments('archived');
    } else {
      this.maintained_currentPage = event.first / event.rows + 1;
      this.maintained_limit = event.rows;
      this.loadDocuments('maintained');
    }
  }

  isFirstPage(type: 'archived' | 'maintained') {
    if (type === 'archived') return this.archivedBooking_currentPage === 1;
    else {
      return this.maintained_currentPage === 1;
    }
  }

  isLastPage(type: 'archived' | 'maintained') {
    if (type === 'archived')
      return (
        this.archivedBooking_currentPage === this.archivedBooking_totalPages
      );
    else return this.maintained_currentPage === this.maintained_totalPages;
  }

  prepareData(type: 'archived' | 'maintained') {
    if (type === 'archived') {
      this.archived_bookings.forEach((booking) => {
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
    } else {
      this.maintained_bookings.forEach((booking) => {
        booking.finishDate = this.timeService.formatDateToDDMMYYYY(
          new Date(booking.finishDate)
        );
        if (booking.lastServiceDate !== null)
          booking.lastServiceDate = this.timeService.formatDateToDDMMYYYY(
            new Date(booking.lastServiceDate)
          );
      });
    }
  }

  hasToRequestMaintaining(index: number) {

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const finishDate = this.timeService.parseDateFromDDMMYY(
      this.archived_bookings.at(index)!.finishDate as string
    );

    let lastServiceDay = this.archived_bookings.at(index)!.lastServiceDate ;

    if (lastServiceDay === null && finishDate <= sixMonthsAgo) return true;

    lastServiceDay = this.timeService.parseDateFromDDMMYY(
      lastServiceDay as string
    );


    return lastServiceDay <= sixMonthsAgo

  }

  requestMaintenance(index: number) {
    
    const data = {
      _id: this.archived_bookings.at(index)?._id!
    }
    const payload = JSON.stringify(data)
    this.bookingService.requestMaintenance(payload).subscribe(data => {
      this.loadDocuments('archived');
      this.loadDocuments('maintained');
    })
  }
}
