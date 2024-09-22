import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonService {


  constructor(private http: HttpClient) { }

  get_layout(filePath:string): Observable<any> {
    return this.http.get<any>(filePath);
  }


}
