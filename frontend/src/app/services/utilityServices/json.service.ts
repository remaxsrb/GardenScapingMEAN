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

  get_layout(fileName:string): Observable<any> {
    return this.http.get<any>(`${this.layoutUrl}/${fileName}`);
  }
  get_photo(fileName:string): Observable<Blob> {
    return this.http.get(`${this.photoUrl}/${fileName}`, { responseType: 'blob' });
  }
}
