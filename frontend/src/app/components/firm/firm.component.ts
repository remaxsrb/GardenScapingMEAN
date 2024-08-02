import { AfterViewInit, Component, OnInit } from "@angular/core";

import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import { Firm } from "src/app/models/firm";
import { GeocodingService } from "src/app/services/utilityServices/geo-coding.service";
import { tileLayerOSMSrbija } from "src/app/OSMSerbia/leafletLayer";

@Component({
  selector: "app-firm",
  templateUrl: "./firm.component.html",
  styleUrls: ["./firm.component.css"],
})
export class FirmComponent implements OnInit, AfterViewInit  {
  constructor(private geocodingService: GeocodingService) {}
  private map!: L.Map;
  firm: Firm = new Firm();
  ngOnInit(): void {
    const firm_data = localStorage.getItem("firm");

    if (firm_data)  this.firm = JSON.parse(firm_data);
    
  }

  
  ngAfterViewInit(): void {
    this.initMap();
    if (this.firm.address) {
      const fullAddress = `${this.firm.address.street} ${this.firm.address.number}, ${this.firm.address.city}`;
      this.geocodeRestaurantAddress(fullAddress);
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([44.788744, 20.459097], 75); // Example coordinates (Humska 1)
    tileLayerOSMSrbija().addTo(this.map);
  }

  private geocodeRestaurantAddress(address: string): void {
    this.geocodingService.geocode(address).subscribe(
      (data) => {
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);
          this.map.setView([lat, lon], 75);
          L.marker([lat, lon]).addTo(this.map);
        } else {
          console.error('No geocoding results found for address:', address);
        }
      },
      (error) => {
        console.error('Error geocoding address:', error);
      }
    );
  }
  
}
