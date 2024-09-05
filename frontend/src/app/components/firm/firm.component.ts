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
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Owner } from 'src/app/models/owner';
import { Service } from 'src/app/interfaces/service';
import { SelectItem } from 'primeng/api/selectitem';
import { Shape } from '../../interfaces/shape';
import { JsonService } from 'src/app/services/utilityServices/json.service';
import { DrawShapesService } from 'src/app/services/utilityServices/draw-shapes.service';
import { BookingService } from 'src/app/services/modelServices/booking.service';
import { Router } from '@angular/router';

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
    private jsonService: JsonService,
    private drawShapesService: DrawShapesService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  private map!: L.Map;
  firm: Firm = new Firm();
  owner: Owner = new Owner();
  gardenForm!: FormGroup;
  newBookingForm!: FormGroup;
  selectedServicesArray: Service[] = [];
  uploadOption: 'canvas' | 'file' = 'canvas'; // Default to canvas
  selectedFile: File | null = null;
  shapes: Shape[] = [];

  activeIndex: number = 0;
  stepsItems: SelectItem[] = [];
  gardenTypes: SelectItem[] = [];

  fileError = false;

  ngOnInit(): void {
    const firm_data = localStorage.getItem('firm');
    //localStorage.removeItem('firm');

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
      sittingArea: [0],
    });
  }

  initNewBookingForm() {
    this.newBookingForm = this.fb.group({
      owner: this.owner._id,
      firm: this.firm._id,
      startDate: [new Date(), [Validators.required]],
      garden: this.gardenForm,
      photo: [''],
      services: JSON.stringify(this.selectedServicesArray),
      requests: [''],
      status: 'active'
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
    return this.gardenForm.get('type')?.value || null;
  }

  get waterArea() {
    return this.gardenForm.get('waterArea');
  }

  get greenArea() {
    return this.gardenForm.get('greenArea');
  }

  get sittingArea() {
    return this.gardenForm.get('sittingArea');
  }

  get requests() {
    return this.newBookingForm.get('requests');
  }

  get services() {
    return this.newBookingForm.get('services');
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
        const startDate = new Date(this.startDate?.value);
        const vacationStart = new Date(this.firm.vacation.start);
        const vacationEnd = new Date(this.firm.vacation.end);

        // Check if the start date is before vacation.start or after vacation.end
        const isStartDateValid =
          this.startDate?.valid &&
          (startDate < vacationStart || startDate > vacationEnd);

        return (
          isStartDateValid &&
          this.width!.valid &&
          this.height!.valid &&
          this.type
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

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }

  onDragStart(event: DragEvent) {
    if (event.dataTransfer) {
      event.dataTransfer.setData(
        'text/plain',
        (event.target as HTMLImageElement).src
      );
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Allow drop
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    this.shapes = this.drawShapesService.drawShape(event, this.shapes);
  }

  toggleService(service: Service, index: number) {
    if (!this.selectedServicesArray.some(s => s.name === service.name)) {
      this.selectedServicesArray.push(service);
    } else {
      this.selectedServicesArray = this.selectedServicesArray.filter(
        (s) => s.name !== service.name
      );
    }
    this.newBookingForm.patchValue({ services: this.selectedServicesArray });
  }

  onSubmit() {
    this.bookingService.create(this.newBookingForm.value).subscribe(
      data => {
        this.newBookingForm.reset()
      }
    )
  }
}
