import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

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

  getReviews(id: string, page: number, limit: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/get_reviews`, {
      params: {
        user: id,
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  }
}
