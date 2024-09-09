import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://127.0.0.1:4000';

  private backendUrl = `${this.apiUrl}/user`;

  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  register(user: any): Observable<any> {
    return this.http.post<any>(
      `${this.backendUrl}/register`,
      user,
      { headers: this.headers }
    );
  }

  login(signInData: any): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/login`, signInData, {
      headers: this.headers,
    });
  }

  findByUsername(username: string) {
    return this.http.get<any>(
      `${this.backendUrl}/read_by_username/${username}`
    );
  }

  findByEmail(email: string) {
    return this.http.get<any>(`${this.backendUrl}/read_by_email/${email}`);
  }

  findByRole(role: string) {
    return this.http.get<any[]>(`${this.backendUrl}/read_by_role/${role}`);
  }

  changePassword(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/update_password`,
      data,
      {
        headers: this.headers,
      }
    );
  }

  updateFirstname(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/update_firstname/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updateLastname(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/update_lastname/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updateUsername(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/update_username/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updateEmail(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/update_email/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updateAddress(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/update_address/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updatePhoneNumber(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/update_phoneNumber/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updateCreditCardNumber(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/update_creditCardNumber/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updateProfilePhoto(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/update_profilePhoto`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  
  updateStatus(_id: string, newStatus: string) {
    const data = {
      _id: _id,
      newStatus: newStatus.toLowerCase(),
    };
    return this.http.post<any>(
      `${this.backendUrl}/update_status/`,
      data,
      {
        headers: this.headers,
      }
    );
  }

  countOwner(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.backendUrl}/count/owner`);
  }
}
