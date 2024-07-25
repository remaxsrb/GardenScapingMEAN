import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) { }

  geocode(address: string): Observable<any> {
    const params = {
      q: address,
      format: 'json',
      addressdetails: '1',
      limit: '1'
    };
    return this.http.get(this.nominatimUrl, { params });
  }

  reverseGeocode(lat: number, lon: number): Observable<any> {
    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
      format: 'json',
      addressdetails: '1'
    };
    return this.http.get(this.nominatimUrl, { params });
  }
}
