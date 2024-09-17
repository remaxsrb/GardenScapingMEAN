import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Firm } from "src/app/models/firm";

@Injectable({
  providedIn: "root",
})
export class FirmService {
  private apiUrl = "http://127.0.0.1:4000";

  private backendUrl = `${this.apiUrl}/firm`;

  private headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {}

  create(firm: any) {
    return this.http.post<any>(`${this.backendUrl}/create`, firm, {
      headers: this.headers,
    });
  }

  getIdName() {
    return this.http.get<Firm[]>(`${this.backendUrl}/all`);
  }

  getName() {
    return this.http.get<String>(`${this.backendUrl}/getname`);
  }
  getDocuments(
    page: number,
    limit: number,
    sortingField: string,
    order: number = 1,
  ): Observable<any> {
    return this.http.get(`${this.backendUrl}/get`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        sortingField: sortingField,
        order: order.toString()
      },
    });
  }

  rate(rateData: any) {
    return this.http.post<any>(`${this.backendUrl}/rate`, rateData, {
      headers: this.headers,
    });
  }


  search(
    name:string,
    street:string,
    number:string,
    city:string,
    page: number,
    limit: number,
  
  ): Observable<any> {
    return this.http.get(`${this.backendUrl}/search`, {
      params: {
        name: name,
        street: street,
        number: number,
        city: city,
        page: page.toString(),
        limit: limit.toString()
       
      },
    });
  }

  
}
