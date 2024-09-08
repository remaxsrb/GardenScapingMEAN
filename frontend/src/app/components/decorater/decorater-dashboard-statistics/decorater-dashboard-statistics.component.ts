import { Component, OnInit } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { Booking } from 'src/app/models/booking';
import { User } from 'src/app/models/user';
import { BookingService } from 'src/app/services/modelServices/booking.service';
import { ChartService } from 'src/app/services/utilityServices/chart.service';

@Component({
  selector: 'app-decorater-dashboard-statistics',
  templateUrl: './decorater-dashboard-statistics.component.html',
  styleUrls: ['./decorater-dashboard-statistics.component.css'],
})
export class DecoraterDashboardStatisticsComponent implements OnInit {
  constructor(
    private bookingService: BookingService,
    private chartService: ChartService
  ) {}

  decorator: User = new User();

  byMonthChartData: any;
  byMonthChartOptions: any;

  byDecoratorInFirmData: any;
  byDecoratorInFirmOptions: any;

  averagePerDayData: any;
  averagePerDatOptions: any;

  ngOnInit(): void {
    const decoratorInfo = localStorage.getItem('user');
    if (decoratorInfo) this.decorator = JSON.parse(decoratorInfo);

    this.bookingService
      .allForDecorator(this.decorator._id)
      .subscribe((data) => {
        const { data: chartData, options } =
          this.chartService.getBookingChartData(data);
        this.byMonthChartData = chartData;
        this.byMonthChartOptions = options;
      });

    this.bookingService.allForFirm(this.decorator.firm).subscribe((data) => {
      const { data: chartData, options } =
        this.chartService.getDecoratorPieChartData(data);
      this.byDecoratorInFirmData = chartData;
      this.byDecoratorInFirmOptions = options;
    });

    this.bookingService.pastTwoYears(this.decorator._id).subscribe((data) => {
      const { data: chartData, options } =
        this.chartService.getWeeklyAverageBookingsData(data);
      this.averagePerDayData = chartData;
      this.averagePerDatOptions = options;
    });
  }
}
