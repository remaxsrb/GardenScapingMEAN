import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
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
  ValidationErrors,
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
import { Message } from 'primeng/api/message';
import { FileService } from 'src/app/services/utilityServices/file.service';

@Component({
  selector: 'app-firm',
  templateUrl: './firm.component.html',
  styleUrls: ['./firm.component.css'],
})
export class FirmComponent
  implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked
{
  @ViewChild('gardenCanvas', { static: false })
  gardenCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private geocodingService: GeocodingService,
    private timeService: TimeService,
    private fb: FormBuilder,
    private jsonService: JsonService,
    private drawShapesService: DrawShapesService,
    private bookingService: BookingService,
    private router: Router,
    private fileService: FileService
  ) {}

  private map!: L.Map;
  firm: Firm = new Firm();
  owner: Owner = new Owner();
  gardenForm!: FormGroup;
  newBookingForm!: FormGroup;
  selectedServicesArray: Service[] = [];
  drawOption: 'draw' | 'file' = 'draw'; // Default to canvas
  selectedFile: File | null = null;
  drawnShapes: Shape[] = [];

  activeIndex: number = 0;
  stepsItems: SelectItem[] = [];
  gardenTypes: SelectItem[] = [];

  fileError = false;
  private canvasInitialized = false;
  overlapError = false;
  errorMessage: Message[] = [];

  shapes: Shape[] = [];

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

  initAvailableShapes() {
    this.shapes = [
      {
        id: 'shape1',
        type: 'rectangle',
        color: '#11ff00',
        width: 50,
        height: 50,
      }, // Square for Private
      { id: 'shape2', type: 'circle', color: 'brown', width: 50, height: 50 }, // Circle for Private
      {
        id: 'shape3',
        type: 'rectangle',
        color: 'gray',
        width: 50,
        height: 100,
      }, // Tall Rectangle for Private
    ];

    if (this.type === 'private')
      this.shapes.push({
        id: 'shape4',
        type: 'rectangle',
        color: '#00a7ff',
        width: 200,
        height: 100,
      }); // Wide Rectangle for Private)
    if (this.type === 'restaurant')
      this.shapes.push({
        id: 'shape5',
        type: 'ellipse',
        color: '#00a7ff',
        width: 200,
        height: 100,
      }); // Ellipse for Public
  }

  ngAfterViewInit() {
    this.initMap();
    if (this.firm.address) {
      const fullAddress = `${this.firm.address.street} ${this.firm.address.number}, ${this.firm.address.city}`;
      this.geocodeRestaurantAddress(fullAddress);
    }
    if (this.activeIndex === 1) {
      this.initializeCanvas();
    }
  }

  ngAfterViewChecked() {
    if (
      this.activeIndex === 1 &&
      this.gardenCanvas &&
      !this.canvasInitialized
    ) {
      this.initializeCanvas();
      this.canvasInitialized = true;
    }
  }

  initializeCanvas() {
    const canvas = this.gardenCanvas.nativeElement;
    const context = canvas.getContext('2d');

    if (context) {
      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (this.activeIndex === 1) {
        //this.drawShapesService.drawShapes(this.shapes);
      }
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('firm');
  }

  initGardenForm() {
    this.gardenForm = this.fb.group({
      width: ['', Validators.required],
      height: ['', Validators.required],
      type: ['', Validators.required],
      waterArea: [0],
      greenArea: [0],
      sittingArea: [0],
      layout: [''],

    });
  }

  initNewBookingForm() {
    this.newBookingForm = this.fb.group({
      owner: this.owner._id,
      firm: this.firm._id,
      bookingDate: [new Date(), [Validators.required]],
      garden: this.gardenForm,
      photo: [''],
      services: [, [Validators.required]],
      requests: [''],
      status: 'active',
    });
  }

  get bookingDate() {
    return this.newBookingForm.get('bookingDate');
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
  
  get layout() {
    return this.gardenForm.get('layout')?.value || null;
  }

  get requests() {
    return this.newBookingForm.get('requests');
  }

  get services() {
    return this.newBookingForm.get('services');
  }

  prevStep() {
    this.activeIndex = Math.max(this.activeIndex - 1, 0);
    if (this.activeIndex !== 1) this.canvasInitialized = false; // Reset initialization flag
  }
  nextStep() {
    if (this.isCurrentStepValid())
      this.activeIndex = Math.min(
        this.activeIndex + 1,
        this.stepsItems.length - 1
      );
    if (this.activeIndex === 1) {
      this.canvasInitialized = false;

      this.initAvailableShapes();
    }
  }
  isCurrentStepValid() {
    switch (this.activeIndex) {
      case 0:
        const startDate = new Date(this.bookingDate?.value);
        const vacationStart = new Date(this.firm.vacation.start);
        const vacationEnd = new Date(this.firm.vacation.end);

        // Check if the start date is before vacation.start or after vacation.end
        const isStartDateValid =
          this.bookingDate?.valid &&
          (startDate < vacationStart || startDate > vacationEnd);

        return (
          isStartDateValid &&
          this.width!.valid &&
          this.width?.value > 0 &&
          this.height!.valid &&
          this.height?.value > 0 &&
          this.type
        );
      case 1:
        return (
          this.waterArea!.valid &&
          this.waterArea?.value > 0 &&
          this.greenArea!.valid &&
          this.greenArea?.value > 0
        );
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

  onOptionChange(option: 'draw' | 'file') {
    this.drawOption = option;
  }

  onFileChange(event: any) {
    const file: File = event.files[0];
    this.selectedFile = file;

    this.fileService.uploadFile(this.selectedFile).subscribe(fileUploadData => {
      console.log(fileUploadData)

      
    this.jsonService.get_layout(fileUploadData.filePath).subscribe(data => {
      const canvas = this.gardenCanvas.nativeElement;
      const context = canvas.getContext('2d');

      this.drawnShapes = data

      this.drawnShapes.forEach(shape => {
        this.drawShapesService.drawShapeOnCanvas(
          context!,
          shape,
          shape.x!,
          shape.y!,
          this.drawnShapes
        );
      });

    })

    })




  }

  onDragStart(event: DragEvent, shape: Shape): void {
    const target = event.target as HTMLElement;

    // Calculate the mouse offset relative to the shape's top-left corner
    const offsetX = event.clientX - target.getBoundingClientRect().left;
    const offsetY = event.clientY - target.getBoundingClientRect().top;

    // Pass the shape's properties and the offset
    const shapeData = { shape, offsetX, offsetY };
    event.dataTransfer?.setData('shapeData', JSON.stringify(shapeData));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Allow drop
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const canvas = this.gardenCanvas.nativeElement;
    const context = canvas.getContext('2d');
    const data = event.dataTransfer?.getData('shapeData');
    if (data) {
      const { shape, offsetX, offsetY } = JSON.parse(data);

      const canvasRect = (
        event.target as HTMLCanvasElement
      ).getBoundingClientRect();
      const x = event.clientX - canvasRect.left - offsetX;
      const y = event.clientY - canvasRect.top - offsetY;
      this.overlapError = false;

      // If drawing was successful (no overlap), store the shape with its position
      if (
        !this.drawShapesService.isOverlapping(
          x,
          y,
          shape.width,
          shape.height,
          this.drawnShapes
        )
      ) {
        // Call drawShapeOnCanvas from the service, which will handle the overlap check
        this.drawShapesService.drawShapeOnCanvas(
          context!,
          shape,
          x,
          y,
          this.drawnShapes
        );
        this.drawnShapes.push({ ...shape, x, y });
      } else this.overlapError = true;
    }

    if (this.overlapError)
      this.errorMessage = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Shapes can not overlap on canvas',
        },
      ];
    else this.errorMessage = [];
  }


  toggleService(service: Service, index: number) {
    if (!this.selectedServicesArray.some((s) => s.name === service.name)) {
      this.selectedServicesArray.push(service);
    } else {
      this.selectedServicesArray = this.selectedServicesArray.filter(
        (s) => s.name !== service.name
      );
    }
    this.newBookingForm.patchValue({ services: this.selectedServicesArray });
  }

  onSubmit() {


    // const jsonData = this.drawnShapes;
    // const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
    //   type: 'application/json',
    // });
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'gardenTest.json';
    // a.click();
    // window.URL.revokeObjectURL(url);
  
    this.gardenForm.patchValue({layout: this.drawnShapes});

    this.bookingService.create(this.newBookingForm.value).subscribe((data) => {
      this.newBookingForm.reset();
      window.location.reload();
    });
  }
}
