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

  getName() {
    return this.http.get<String>(`${this.backendUrl}/getname`);
  }
  getDocuments(
    page: number,
    limit: number,
    field: string,
    order: number = 1,
  ): Observable<any> {
    return this.http.get(`${this.backendUrl}/get`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        field: field,
        order: order.toString()
      },
    });
  }

  rate(rateData: any) {
    return this.http.post<any>(`${this.backendUrl}/rate`, rateData, {
      headers: this.headers,
    });
  }

  sortPaginated(field: string, order: number, page: number, limit: number) {
    return this.http.get<Firm[]>(
      `${this.backendUrl}/sort?field=${field}&order=${order}&page=${page}&limit=${limit}`,
    );
  }

  readByFields(searchData: any) {
    const name = searchData.name;
    const street = searchData.address.street;
    const number = searchData.address.number;
    const city = searchData.address.city;

    return this.http.get<Firm[]>(
      `${this.backendUrl}/read?name=${name}&street=${street}&number=${number}&city=${city}`,
    );
  }
}
