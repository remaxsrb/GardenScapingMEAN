import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private apiUrl = 'http://127.0.0.1:4000';
  private backendUrl = `${this.apiUrl}/file`;

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  getFile(fileName: string) {
    const params = new HttpParams().set('fileName', fileName);
    return this.http.get<any>(`${this.backendUrl}/getFile`, { params });
  }

  getFilePath(fileName: string) {
    const params = new HttpParams().set('fileName', fileName);
    return this.http.get<any>(`${this.backendUrl}/getFilePath`, { params });
  }

  uploadFile(file:any) {

    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<any>(`${this.backendUrl}/upload`, formData);
  }
}
