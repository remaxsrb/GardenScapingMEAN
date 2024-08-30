import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import { Firm } from 'src/app/models/firm';
import { GeocodingService } from 'src/app/services/utilityServices/geo-coding.service';
import { tileLayerOSMSrbija } from 'src/app/OSMSerbia/leafletLayer';
import { TimeService } from 'src/app/services/utilityServices/time.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Owner } from 'src/app/models/owner';
import { Service } from 'src/app/interfaces/service';
import { SelectItem } from 'primeng/api/selectitem';
import { Shape } from '../../interfaces/shape';

@Component({
  selector: 'app-firm',
  templateUrl: './firm.component.html',
  styleUrls: ['./firm.component.css'],
})
export class FirmComponent implements OnInit, AfterViewInit {
  
  constructor(
    private geocodingService: GeocodingService,
    private timeService: TimeService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  private map!: L.Map;
  firm: Firm = new Firm();
  owner: Owner = new Owner();
  servicesArray!: FormArray;
  gardenForm!: FormGroup;
  newBookingForm!: FormGroup;

  uploadOption: 'canvas' | 'file' = 'canvas'; // Default to canvas
  shapes: Shape[] = []; 

  activeIndex: number = 1;
  stepsItems: SelectItem[] = [];
  gardenTypes: SelectItem[] = [];

  fileError = false;

  ngOnInit(): void {
    const firm_data = localStorage.getItem('firm');

    if (firm_data) this.firm = JSON.parse(firm_data);
    this.firm.vacation.start = this.timeService.formatDateToDDMMYYYY(
      new Date(this.firm.vacation.start)
    );
    this.firm.vacation.end = this.timeService.formatDateToDDMMYYYY(
      new Date(this.firm.vacation.end)
    );

    const ownerInfo = localStorage.getItem('user');
    if (ownerInfo) this.owner = JSON.parse(ownerInfo);

    this.stepsItems = [
      { label: 'Garden Details', value: 'details' },
      { label: 'Areas & Canvas', value: 'areas' },
      { label: 'Additional Requests', value: 'requests' },
    ];

    this.gardenTypes = [
      { label: 'Private', value: 'private' },
      { label: 'Restaurant', value: 'restaurant' },
    ];

    this.initServicesArray();
    this.initGardenForm();
    this.initNewBookingForm();
  }

  ngAfterViewInit(): void {
    this.initMap();
    if (this.firm.address) {
      const fullAddress = `${this.firm.address.street} ${this.firm.address.number}, ${this.firm.address.city}`;
      this.geocodeRestaurantAddress(fullAddress);
    }
  }

  previousStep() {
    this.activeIndex--;
  }


  initGardenForm() {
    this.gardenForm = this.fb.group({
      width: ['', Validators.required],
      height: ['', Validators.required],
      type: ['', Validators.required],
      waterArea: [0],
      greenArea: [0],
      tables: [0],
      chairs: [0],
    });
  }

  initServicesArray() {
    this.servicesArray = this.fb.array([], Validators.required);
  }

  initNewBookingForm() {
    this.newBookingForm = this.fb.group({
      owner: this.owner._id,
      firm: this.firm._id,
      startDate: [new Date(), [Validators.required]],
      garden: this.gardenForm,
      photo: [''],
      requests: [''],
    });
  }

  get startDate() {
    return this.newBookingForm.get('startDate');
  }

  get width() {
    return this.gardenForm.get('width');
  }

  get height() {
    return this.gardenForm.get('height');
  }

  get type() {
    return this.gardenForm.get('type');
  }

  get waterArea() {
    return this.gardenForm.get('waterArea');
  }

  get greenArea() {
    return this.gardenForm.get('greenArea');
  }

  get requests() {
    return this.newBookingForm.get('requests');
  }

  prevStep() {
    this.activeIndex = Math.max(this.activeIndex - 1, 0);
  }

  nextStep() {
    if (this.isCurrentStepValid())
      this.activeIndex = Math.min(
        this.activeIndex + 1,
        this.stepsItems.length - 1
      );
  }

  isCurrentStepValid() {
    switch (this.activeIndex) {
      case 0:
        return (
          this.startDate!.valid &&
          this.width!.valid &&
          this.height!.valid &&
          this.type!.valid
        );
      case 1:
        return this.waterArea!.valid && this.greenArea!.valid;
      case 2:
        return this.requests!.valid;
      default:
        return false;
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

  onOptionChange(option: 'canvas' | 'file') {
    this.uploadOption = option;
  }

  onFileChange(event: any) {}

  onDragStart(event: DragEvent) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', (event.target as HTMLImageElement).src);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Allow drop
  }

onDrop(event: DragEvent) {
    event.preventDefault();
    
    const canvas = document.getElementById('gardenCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !event.dataTransfer) return;

    const imageSrc = event.dataTransfer.getData('text/plain');
    const img = new Image();
    img.src = imageSrc;

    const dropX = event.offsetX;
    const dropY = event.offsetY;

    img.onload = () => {
      const shapeWidth = img.naturalWidth; // Use the image's natural width
      const shapeHeight = img.naturalHeight; // Use the image's natural height

      // Check if the new shape will overlap with any existing shape
      const isOverlapping = this.shapes.some(shape => 
        dropX < shape.x + shape.width &&
        dropX + shapeWidth > shape.x &&
        dropY < shape.y + shape.height &&
        dropY + shapeHeight > shape.y
      );

      if (isOverlapping) {
        alert('Shape cannot overlap with another shape!');
        return; // Prevent the shape from being drawn
      }

      // Draw the image if it does not overlap
      ctx.drawImage(img, dropX, dropY, shapeWidth, shapeHeight);

      // Add the new shape to the shapes array
      this.shapes.push({
        x: dropX,
        y: dropY,
        width: shapeWidth,
        height: shapeHeight,
        imageSrc: imageSrc
      });
    };
  }
}
