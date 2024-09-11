import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  private apiUrl = 'http://127.0.0.1:4000';
  private backendUrl = `${this.apiUrl}/captcha`;

  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {
  }


  validate(captchaResponse: any) {

    const payload = JSON.stringify({token: captchaResponse})

    return this.http.post<any>(`${this.backendUrl}/validate`, payload, {
      headers: this.headers,
    });
  }

}
