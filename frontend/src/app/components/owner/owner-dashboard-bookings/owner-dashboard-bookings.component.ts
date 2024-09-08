import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking } from 'src/app/models/booking';
import { Comment } from 'src/app/models/comment';
import { User } from 'src/app/models/user';
import { BookingService } from 'src/app/services/modelServices/booking.service';
import { CommentService } from 'src/app/services/modelServices/comment.service';
import { FirmService } from 'src/app/services/modelServices/firm.service';
import { TimeService } from 'src/app/services/utilityServices/time.service';

@Component({
  selector: 'app-owner-dashboard-bookings',
  templateUrl: './owner-dashboard-bookings.component.html',
  styleUrls: ['./owner-dashboard-bookings.component.css'],
})
export class OwnerDashboardBookingsComponent implements OnInit {
  constructor(
    private bookingService: BookingService,
    private timeService: TimeService,
    private commentService: CommentService,
    private fb: FormBuilder
  ) {}

  owner = new User();

  active_bookings: Booking[] = [];
  activeBooking_currentPage: number = 1;
  activeBooking_limit: number = 5;
  activeBooking_totalPages: number = -1;
  activeBooking_number_of_bookings: number = 0;

  archived_bookings: Booking[] = [];
  archivedBooking_currentPage: number = 1;
  archivedBooking_limit: number = 5;
  archivedBooking_totalPages: number = -1;
  archivedBooking_number_of_bookings: number = 0;

  commentForm!: FormGroup;

  comments: Comment[] = [];

  ngOnInit(): void {
    const ownerInfo = localStorage.getItem('user');
    if (ownerInfo) this.owner = JSON.parse(ownerInfo);
    this.initCommentForm();
    this.loadDocuments('active');
    this.loadDocuments('archived');
  }

  initCommentForm() {
    this.commentForm = this.fb.group({
      user: this.owner._id,
      booking: [''],
      finishDate: null,
      type: 'review',
      text: ['', Validators.required],
    });
  }

  loadDocuments(type: 'active' | 'archived') {
    if (type === 'active') {
      this.bookingService
        .getActiveBookings(
          this.owner._id,
          this.activeBooking_currentPage,
          this.activeBooking_limit
        )
        .subscribe((data) => {
          this.active_bookings = data.bookings;
          this.activeBooking_currentPage = data.page;
          this.activeBooking_number_of_bookings = data.totalDocuments;
          this.activeBooking_totalPages = data.totalPages;

          this.prepareData('active');
        });
    } else {
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

      this.commentService
        .getReviews(
          this.owner._id,
          this.archivedBooking_currentPage,
          this.archivedBooking_limit
        )
        .subscribe((data) => {
          this.comments = data.comments;
          console.log(this.comments)
        });
    }
  }

  pageChange(event: any, type: 'active' | 'archived') {
    if (type === 'active') {
      this.activeBooking_currentPage = event.first / event.rows + 1;
      this.activeBooking_limit = event.rows;
      this.loadDocuments(type);
    } else {
      this.archivedBooking_currentPage = event.first / event.rows + 1;
      this.archivedBooking_limit = event.rows;
      this.loadDocuments(type);
    }
  }

  isFirstPage(type: 'active' | 'archived') {
    if (type === 'active') {
      return this.activeBooking_currentPage === 1;
    } else {
      return this.archivedBooking_currentPage === 1;
    }
  }

  isLastPage(type: 'active' | 'archived') {
    if (type === 'active') {
      return this.activeBooking_currentPage === this.activeBooking_totalPages;
    } else {
      return (
        this.archivedBooking_currentPage === this.archivedBooking_totalPages
      );
    }
  }

  prepareData(type: 'active' | 'archived') {
    if (type === 'active') {
      this.active_bookings.forEach((booking) => {
        booking.bookingDate = this.timeService.formatDateToDDMMYYYY(
          new Date(booking.bookingDate)
        );
        if (booking.startDate !== null)
          booking.startDate = this.timeService.formatDateToDDMMYYYY(
            new Date(booking.startDate)
          );
      });
    }
    if (type === 'archived') {
      this.archived_bookings.forEach((booking) => {
        booking.bookingDate = this.timeService.formatDateToDDMMYYYY(
          new Date(booking.bookingDate)
        );
        if (booking.finishDate !== null)
          booking.finishDate = this.timeService.formatDateToDDMMYYYY(
            new Date(booking.finishDate)
          );
      });
    }
  }

  canCancelBooking(index: number) {
    let startDate = this.active_bookings.at(index)?.startDate;
    if (startDate === null) return false;

    startDate = this.timeService.parseDateFromDDMMYY(
      this.active_bookings.at(index)?.startDate as string
    );
    return this.timeService.getDaysDifference(startDate, new Date()) > 1;
  }

  cancelBooking(index: number) {
    const toDelete = {
      _id: this.active_bookings.at(index)?._id!,
    };
    this.bookingService
      .cancelBooking(JSON.stringify(toDelete))
      .subscribe((data) => {
        window.location.reload();
      });
  }

  canComment(index: number) {
    let comment = this.comments[index];

    if (comment === undefined) return true;
    return false;
  }

  review(index: number) {
    this.commentForm.patchValue({ booking: this.archived_bookings.at(index)?._id });

    const finishDate = this.timeService.parseDateFromDDMMYY(this.archived_bookings.at(index)?.finishDate as string);

    this.commentForm.patchValue({ finishDate});
    this.commentService
      .create(this.commentForm.value)
      .subscribe((data) => {
          window.location.reload();
      });
  }

  canRate(index: number) {
    let rating = this.archived_bookings.at(index)?.rating!;
    if (rating > 0) return false;
    return true;
  }

  handleRatingClick(event: any, index: number): void {
    const data = {
      _id: this.archived_bookings.at(index)?._id,
      rating: event.value,
    };

    this.bookingService.rate(JSON.stringify(data)).subscribe((data) => {
      window.location.reload();
    });
  }
}
