import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking } from 'src/app/models/booking';
import { User } from 'src/app/models/user';
import { BookingService } from 'src/app/services/modelServices/booking.service';
import { CommentService } from 'src/app/services/modelServices/comment.service';
import { FileService } from 'src/app/services/utilityServices/file.service';
import { ImageValidationService } from 'src/app/services/utilityServices/image-validation-service.service';
import { TimeService } from 'src/app/services/utilityServices/time.service';

@Component({
  selector: 'app-decorater-dashboard-bookings',
  templateUrl: './decorater-dashboard-bookings.component.html',
  styleUrls: ['./decorater-dashboard-bookings.component.css'],
})
export class DecoraterDashboardBookingsComponent implements OnInit {
  constructor(
    private bookingService: BookingService,
    private commentService: CommentService,
    private timeService: TimeService,
    private fb: FormBuilder,
    private fileService: FileService,
    private imageValidationService: ImageValidationService,

  ) {}

  action: string = 'startJob';
  decorator: User = new User();

  jobsToStart: Booking[] = [];
  jobsToStart_currentPage: number = 1;
  jobsToStart_limit: number = 2;
  jobsToStart_totalPages: number = -1;
  jobsToStartNumber: number = 0;

  jobsToEnd: Booking[] = [];
  jobsToEnd_currentPage: number = 1;
  jobsToEnd_limit: number = 2;
  jobsToEnd_totalPages: number = -1;
  jobsToEndNumber: number = 0;

  acceptJobForm!: FormGroup;
  rejectJobForm!: FormGroup;

  endJobForm!: FormGroup;
  selectedFile: File | null = null;
  validDimensions: boolean = false;

  invalidStartDate: boolean = true;

  ngOnInit(): void {
    const decoratorInfo = localStorage.getItem('user');
    if (decoratorInfo) this.decorator = JSON.parse(decoratorInfo);

    this.initAcceptForm();
    this.initEndJobForm();
    this.initRejectForm();

    this.loadDocuments('start');
    this.loadDocuments('end');
  }

  initAcceptForm() {
    this.acceptJobForm = this.fb.group({
      _id: [''],
      startDate: [new Date(), [Validators.required]],
      decorator: this.decorator._id,
    });
  }

  initEndJobForm() {
    this.endJobForm = this.fb.group({
      _id: [''],
      finishDate: [new Date(), [Validators.required]],
      photo: [''],
    });
  }

  initRejectForm() {
    this.rejectJobForm = this.fb.group({
      user: this.decorator._id,
      booking: [''],
      type: 'rejection',
      text: ['', Validators.required],
    });
  }

  acceptJob(index: number) {
    const bookingDate = this.timeService.parseDateFromDDMMYY(
      this.jobsToStart.at(index)!.bookingDate as string
    );
    const startDate = new Date(this.acceptJobForm.get('startDate')?.value!);

    if (bookingDate.getTime() > startDate.getTime()) {
      this.invalidStartDate = true;
      return;
    }
    this.invalidStartDate = false;
    this.acceptJobForm.patchValue({ _id: this.jobsToStart.at(index)?._id });
    this.bookingService
      .acceptJob(this.acceptJobForm.value)
      .subscribe((data) => {
        window.location.reload();
      });
  }

  rejectJob(index: number) {
    this.rejectJobForm.patchValue({ booking: this.jobsToStart.at(index)?._id });
    this.commentService.create(this.rejectJobForm.value).subscribe((data) => {
      window.location.reload();
    });
  }

  onSelect(event: any) {
    this.validDimensions = true;
    this.selectedFile = event.files[0]; // Store the actual File object
    this.imageValidationService
      .validateImageDimensions(this.selectedFile!)
      .subscribe((data) => {
        this.validDimensions = data;

        if(this.validDimensions)
          this.endJobForm.patchValue({ photo: this.selectedFile }); 

      });

  }

  finishJob(index: number) {
    const startDate = this.timeService.parseDateFromDDMMYY(
      this.jobsToEnd.at(index)!.startDate as string
    );
    const finishDate = new Date(this.endJobForm.get('finishDate')?.value!);

    if (startDate.getTime() > finishDate.getTime()) {
      return;
    }

    if (this.selectedFile) {
      this.fileService.uploadFile(this.selectedFile).subscribe((data) => {
        this.endJobForm.patchValue({
          photo: data.filePath,
        });

        this.endJobForm.patchValue({ _id: this.jobsToEnd.at(index)?._id });
        this.bookingService
          .finishJob(this.endJobForm.value)
          .subscribe((data) => {
            window.location.reload();
          });
      });
    }
  }

  loadDocuments(type: 'start' | 'end') {
    if (type === 'start') {
      this.bookingService
        .getNotStarted(
          this.decorator.firm,
          this.jobsToStart_currentPage,
          this.jobsToStart_limit
        )
        .subscribe((data) => {
          this.jobsToStart = data.bookings;
          this.jobsToStart_currentPage = data.page;
          this.jobsToStartNumber = data.totalDocuments;
          this.jobsToStart_totalPages = data.totalPages;

          this.prepareData('start');
        });
    } else {
      this.bookingService
        .getJobsToFinish(
          this.decorator._id,
          this.jobsToEnd_currentPage,
          this.jobsToEnd_limit
        )
        .subscribe((data) => {
          this.jobsToEnd = data.bookings;
          this.jobsToEnd_currentPage = data.page;
          this.jobsToEndNumber = data.totalDocuments;
          this.jobsToEnd_totalPages = data.totalPages;

          this.prepareData('end');
        });
    }
  }

  pageChange(event: any, type: 'start' | 'end') {
    if (type === 'start') {
      this.jobsToStart_currentPage = event.first / event.rows + 1;
      this.jobsToStart_limit = event.rows;
      this.loadDocuments(type);
    } else {
      this.jobsToEnd_currentPage = event.first / event.rows + 1;
      this.jobsToEnd_limit = event.rows;
      this.loadDocuments(type);
    }
  }

  isFirstPage(type: 'start' | 'end') {
    if (type === 'start') {
      return this.jobsToStart_currentPage === 1;
    } else {
      return this.jobsToEnd_currentPage === 1;
    }
  }

  isLastPage(type: 'start' | 'end') {
    if (type === 'start') {
      return this.jobsToStart_currentPage === this.jobsToStart_totalPages;
    } else {
      return this.jobsToEnd_currentPage === this.jobsToEnd_totalPages;
    }
  }

  prepareData(type: 'start' | 'end') {
    if (type === 'start') {
      this.jobsToStart.forEach((booking) => {
        booking.bookingDate = this.timeService.formatDateToDDMMYYYY(
          new Date(booking.bookingDate)
        );
      });
    }
    if (type === 'end') {
      this.jobsToEnd.forEach((booking) => {
        if (booking.startDate !== null)
          booking.startDate = this.timeService.formatDateToDDMMYYYY(
            new Date(booking.startDate)
          );
        booking.bookingDate = this.timeService.formatDateToDDMMYYYY(
          new Date(booking.bookingDate)
        );
      });
    }
  }
}
