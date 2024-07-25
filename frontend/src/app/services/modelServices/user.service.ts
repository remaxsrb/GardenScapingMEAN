import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://127.0.0.1:4000';

  backendUrl = `${this.apiUrl}/user`;

  headers = new HttpHeaders().set('Content-Type', 'application/json');

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
      `${this.backendUrl}/readByUsername/${username}`
    );
  }

  findByEmail(email: string) {
    return this.http.get<any>(`${this.backendUrl}/readByEmail/${email}`);
  }

  findByRole(role: string) {
    return this.http.get<any[]>(`${this.backendUrl}/readByRole/${role}`);
  }

  changePassword(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/updatePassword/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }

  updateFirstname(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/updateFirstname/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updateLastname(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/updateLastname/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updateUsername(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/updateUsername/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updateEmail(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/updateEmail/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updateAddress(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/updateAddress/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updatePhoneNumber(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/updatePhoneNumber/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updateCreditCardNumber(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/updateCreditCardNumber/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  updateProfilePhoto(data: any) {
    return this.http.post<any>(
      `${this.backendUrl}/updateProfilePhoto/`,
      JSON.stringify(data),
      {
        headers: this.headers,
      }
    );
  }
  
  updateStatus(username: string, newStatus: string) {
    const data = {
      username: username,
      new_status: newStatus.toLowerCase(),
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
