import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/models/booking';
import { User } from 'src/app/models/user';
import { BookingService } from 'src/app/services/modelServices/booking.service';
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

  ngOnInit(): void {
    const ownerInfo = localStorage.getItem('user');
    if (ownerInfo) this.owner = JSON.parse(ownerInfo);

    this.loadDocuments('active');
    this.loadDocuments('archived');
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
          this.archived_bookings = data;
          this.archivedBooking_currentPage = data.page;
          this.archivedBooking_number_of_bookings = data.totalDocuments;
          this.archivedBooking_totalPages = data.totalPages;
          this.prepareData('archived');
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

  //?Inside this function fetch firm name based on ID ====> NAIVE SOLUTION

  prepareData(type: 'active' | 'archived') {
    if (type === 'active') {
      this.active_bookings.forEach((booking) => {
        booking.startDate = this.timeService.formatDateToDDMMYYYY(
          new Date(booking.startDate)
        );

      });
    } else {
      this.archived_bookings.forEach((booking) => {
        booking.startDate = this.timeService.formatDateToDDMMYYYY(
          new Date(booking.startDate)
        );
      });
    }
  }
}
