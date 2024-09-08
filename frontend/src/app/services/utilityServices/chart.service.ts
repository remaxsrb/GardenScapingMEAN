import { Injectable } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  getBookingChartData(bookings: any[]): { data: ChartData<'bar'>, options: ChartOptions<'bar'> } {
    // Transform bookings data into monthly counts
    const bookingsByMonth = new Array(12).fill(0);

    if (Array.isArray(bookings)) {
      bookings.forEach((booking: any) => {
        const month = new Date(booking.bookingDate).getMonth(); // Adjust according to your date format
        bookingsByMonth[month]++;
      });
    } else {
      console.warn('Bookings data is not an array or is undefined');
    }

    const data: ChartData<'bar'> = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Bookings',
        data: bookingsByMonth,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      scales: {
        x: {
          ticks: {
            autoSkip: false // Ensures all months are displayed
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1 // Increments Y-axis by 1
          }
        }
        
      },
      
    };

    return { data, options };
  }

  getDecoratorPieChartData(bookings: any[]): { data: ChartData<'pie'>, options: ChartOptions<'pie'> } {
    const decoratorMap = new Map<string, number>();

    // Aggregate bookings count by decorator ID
    bookings.forEach((booking: any) => {
      const decoratorId = booking.decorator; // Adjust property name if necessary
      if (decoratorId) {
        if (decoratorMap.has(decoratorId)) {
          decoratorMap.set(decoratorId, decoratorMap.get(decoratorId)! + 1);
        } else {
          decoratorMap.set(decoratorId, 1);
        }
      }
    });

    // Prepare data for the pie chart
    const data: number[] = [];
    decoratorMap.forEach(count => data.push(count));

    const chartData: ChartData<'pie'> = {
      labels: [], // No labels needed
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    };

    const options: ChartOptions<'pie'> = {
      responsive: true,
      plugins: {
        legend: {
          display: false 
        },
        tooltip: {
          enabled: false
        },
        title: {
          display: true,
          text: 'Bookings by Decorator in a firm', 
          font: {
            size: 16 
          },
          padding: {
            top: 10,
            bottom: 20 
          }
        }
      }
    };

    return { data: chartData, options };
  }


  getWeeklyAverageBookingsData(bookings: any[]): { data: ChartData<'bar'>, options: ChartOptions<'bar'> } {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const totalBookings = new Array(7).fill(0);
    const counts = new Array(7).fill(0);

    bookings.forEach((booking: any) => {
      const date = new Date(booking.bookingDate); 

      const day = (date.getDay() + 6) % 7;
      totalBookings[day]++;
      counts[day]++;
    });

    const averages = totalBookings.map((total, index) => counts[index] > 0 ? total / counts[index] : 0);

    const chartData: ChartData<'bar'> = {
      labels: daysOfWeek,
      datasets: [{
        label: 'Average',
        data: averages,
        backgroundColor: 'rgba(153, 102, 255, 0.2)', 
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }]
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true
        },
        title: {
          display: true,
          text: 'Average Number of Bookings per Day of the Week', // Set your title here
          font: {
            size: 16 // Font size for the title
          },
          padding: {
            bottom: 20 // Space below the title
          }
        }
      }
    };

    return { data: chartData, options };
  }

}
