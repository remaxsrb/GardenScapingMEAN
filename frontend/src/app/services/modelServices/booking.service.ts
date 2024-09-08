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

  latest_photos(): Observable<any> {
    return this.http.get(`${this.backendUrl}/latest_photos`);
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

  allForDecorator(id: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/all_for_decorator`, {
      params: {
        id: id,
      },
    });
  }

  allForFirm(id: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/all_for_firm`, {
      params: {
        id: id,
      },
    });
  }

  pastTwoYears(id: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/past_two_years`, {
      params: {
        id: id,
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

  getMaintained(id: string, page: number, limit: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/maintain_for_owner`, {
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

  maintain(data: any) {
    return this.http.post<any>(`${this.backendUrl}/maintain`, data, {
      headers: this.headers,
    });
  }

  finishJob(data: any) {
    return this.http.post<any>(`${this.backendUrl}/finish_job`, data, {
      headers: this.headers,
    });
  }

  rate(data: any) {
    return this.http.post<any>(`${this.backendUrl}/rate`, data, {
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

  requestMaintenance(_id: string) {
    return this.http.post<any>(`${this.backendUrl}/request_maintenance`, _id, {
      headers: this.headers,
    });
  }

  rejectMaintenance(_id: string) {
    return this.http.post<any>(`${this.backendUrl}/reject_maintenance`, _id, {
      headers: this.headers,
    });
  }

  toMaintain(id: string, page: number, limit: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/maintain_for_decorator`, {
      params: {
        id: id,
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  }
}
