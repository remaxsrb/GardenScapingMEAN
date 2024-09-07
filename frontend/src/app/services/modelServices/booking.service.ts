import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://127.0.0.1:4000';

  backendUrl = `${this.apiUrl}/booking`;

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  create(booking: any) {
    return this.http.post<any>(`${this.backendUrl}/create`, booking, {
      headers: this.headers,
    });
  }

  getPastDayCount(): Observable<any> {
    return this.http.get(`${this.backendUrl}/past_day_count`);
  }

  getPastWeekCount(): Observable<any> {
    return this.http.get(`${this.backendUrl}/past_week_count`);
  }

  getPastMonthCount(): Observable<any> {
    return this.http.get(`${this.backendUrl}/past_month_count`);
  }

  getActiveBookings(id: string, page: number, limit: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/active_booking_desc`, {
      params: {
        id: id,
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  }

  getArchivedBookings(
    id: string,
    page: number,
    limit: number
  ): Observable<any> {
    return this.http.get(`${this.backendUrl}/archived_booking_desc`, {
      params: {
        id: id,
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  }

  getNotStarted(id: string, page: number, limit: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/non_started`, {
      params: {
        id: id,
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  }

  acceptJob(data: any) {
    return this.http.post<any>(`${this.backendUrl}/accept_job`, data, {
      headers: this.headers,
    });
  }

  cancelBooking(_id: string) {
    return this.http.post<any>(`${this.backendUrl}/cancel_booking`, _id, {
      headers: this.headers,
    });
  }

  getJobsToFinish(id: string, page: number, limit: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/jobs_to_finish`, {
      params: {
        id: id,
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  }
}
