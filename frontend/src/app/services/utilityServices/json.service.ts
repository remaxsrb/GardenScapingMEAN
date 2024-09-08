import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  private layoutUrl = 'assets/gardenLayouts'; 
  private photoUrl = 'assets/photos'; 

  private apiUrl = 'http://127.0.0.1:4000';

  backendUrl = `${this.apiUrl}/file`;

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  get_layout(fileName:string): Observable<string> {
    return this.http.get<string>(`${this.layoutUrl}/${fileName}`);
  }

  saveLayout(data: any) {
    return this.http.post<any>(`${this.backendUrl}/save`, data, {
      headers: this.headers,
    });
  }

  get_photo(fileName:string): Observable<Blob> {
    return this.http.get(`${this.photoUrl}/${fileName}`, { responseType: 'blob' });
  }
}
