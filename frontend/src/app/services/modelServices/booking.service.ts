import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
}
