import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Firm } from "src/app/models/firm";

@Injectable({
  providedIn: "root",
})
export class FirmService {
  private apiUrl = "http://127.0.0.1:4000";

  backendUrl = `${this.apiUrl}/firm`;

  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {}

  create(firm: any) {
    return this.http.post<any>(`${this.backendUrl}/create`, firm, {
      headers: this.headers,
    });
  }
  
  getIdName() {
    return this.http.get<Firm[]>(`${this.backendUrl}/all`);
  }

  getDocuments(page: number, limit: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/get`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  }

  rate(rateData: any) {
    return this.http.post<any>(`${this.backendUrl}/rate`, rateData, {
      headers: this.headers,
    });
  }
  sortNameAsc() {}
  sortNameDesc() {}
  sortAddressAsc() {}
  sortAddressDesc() {}
  readByFields(name: string, street: string, number: string, city: string) {
    return this.http.get(
      `${this.apiUrl}/read?name=${name}&street=${street}&number=${number}&city=${city}`,
    );
  }
}
