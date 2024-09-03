import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = "http://127.0.0.1:4000";

  backendUrl = `${this.apiUrl}/booking`;

  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {}

  create(booking: any) {
    return this.http.post<any>(`${this.backendUrl}/create`, booking, {
      headers: this.headers,
    });
  }

  getDocuments(
    page: number,
    limit: number,

  ): Observable<any> {
    return this.http.get(`${this.backendUrl}/get_start_asc`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),

      },
    });
  }
}
