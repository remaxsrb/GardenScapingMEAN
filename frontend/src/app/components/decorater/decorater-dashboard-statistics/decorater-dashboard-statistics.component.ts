import { Component, OnInit } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { Booking } from 'src/app/models/booking';
import { User } from 'src/app/models/user';
import { BookingService } from 'src/app/services/modelServices/booking.service';

@Component({
  selector: 'app-decorater-dashboard-statistics',
  templateUrl: './decorater-dashboard-statistics.component.html',
  styleUrls: ['./decorater-dashboard-statistics.component.css'],
})
export class DecoraterDashboardStatisticsComponent implements OnInit {
  constructor(private bookingService: BookingService) {}

  decorator: User = new User();
  bookingsForDecorator: Booking[] = [];
  byMonthChartData: any;

  ngOnInit(): void {
    const decoratorInfo = localStorage.getItem('user');
    if (decoratorInfo) this.decorator = JSON.parse(decoratorInfo);

    this.bookingService
      .allForDecorator(this.decorator._id)
      .subscribe((data) => {
        this.bookingsForDecorator = data.bookings;
        this.prepareChartData();
      });
  }

  prepareChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color').trim();
    const textColorSecondary = documentStyle
      .getPropertyValue('--text-color-secondary')
      .trim();
    const surfaceBorder = documentStyle
      .getPropertyValue('--surface-border')
      .trim();

    const months = Array.from({ length: 12 }, (_, i) => i + 1); // Months 1-12
    const monthLabels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const bookingCounts = months.map((month) => {
      return this.bookingsForDecorator.filter(
        (booking) => new Date(booking.bookingDate).getMonth() + 1 === month
      ).length;
    });

    const maxBookingCount = Math.max(...bookingCounts);

    this.byMonthChartData = {
      labels: monthLabels,
      datasets: [
        {
          label: 'Booking Count',
          data: bookingCounts,
          backgroundColor: '#42A5F5',
        },
      ],
      options: {
        scales: {
          x: {
            ticks: {
              color: textColor,
              autoSkip: false,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
              borderWidth: 1,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: textColor,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
              borderWidth: 1,
            },
            suggestedMax: maxBookingCount + 1,
          },
        },
      },
    };
  }
}
