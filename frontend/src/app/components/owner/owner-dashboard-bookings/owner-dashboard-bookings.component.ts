import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/modelServices/booking.service';

@Component({
  selector: 'app-owner-dashboard-bookings',
  templateUrl: './owner-dashboard-bookings.component.html',
  styleUrls: ['./owner-dashboard-bookings.component.css']
})
export class OwnerDashboardBookingsComponent implements OnInit{


  constructor(private bookingService: BookingService) {}

  bookings: Booking[] = []
  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = -1;
  number_of_bookings: number = 0;

  ngOnInit(): void {
    this.loadDocuments() 
  }

  loadDocuments() {
    this.bookingService
    .getDocuments(this.currentPage, this.limit)
    .subscribe((data) => {
      this.bookings = data.firms;
      this.totalPages = data.totalPages;
      this.number_of_bookings = data.totalDocuments;
    });
  }


  pageChange(event: any) {
    this.currentPage = event.first / event.rows + 1; // Calculate the current page
    this.limit = event.rows;
    this.loadDocuments();
  }

  isFirstPage() {
    return this.currentPage === 1;
  }

  isLastPage() {
    return this.currentPage === this.totalPages;
  }

}
