import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  private layoutUrl = 'assets/gardenLayouts'; 
  private photoUrl = 'assets/photos'; 

   

  constructor(private http: HttpClient) { }

  get_layout(file_name:string): Observable<any> {
    return this.http.get<any>(`${this.layoutUrl}/${file_name}`);
  }
  get_photo(file_name:string): Observable<Blob> {
    return this.http.get(`${this.photoUrl}/${file_name}`, { responseType: 'blob' });
  }
}
