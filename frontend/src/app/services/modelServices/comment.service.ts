import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = "http://127.0.0.1:4000";

  backendUrl = `${this.apiUrl}/comment`;

  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {}

  create(comment: any) {
    return this.http.post<any>(`${this.backendUrl}/create`, comment, {
      headers: this.headers,
    });
  }
}
