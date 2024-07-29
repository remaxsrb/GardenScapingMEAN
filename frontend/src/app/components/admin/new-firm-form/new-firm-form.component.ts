import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Message } from "primeng/api";
import { RegexPatterns } from "src/app/regexPatterns";
import { FirmService } from "src/app/services/modelServices/firm.service";

@Component({
  selector: "app-new-firm-form",
  templateUrl: "./new-firm-form.component.html",
  styleUrls: ["./new-firm-form.component.css"],
})
export class NewFirmFormComponent implements OnInit {
  constructor(
    private firmService: FirmService,
    private fb: FormBuilder,
  ) {}

  addressForm!: FormGroup;
  vacationForm!: FormGroup;
  servicesArray!: FormArray;
  newFirmForm!: FormGroup;
  
  minDate: Date = new Date()
  
  firmCreated: boolean = false;
  messages: Message[] | undefined;
  
  ngOnInit(): void {
    this.initAddressForm();
    this.initServicesArray();
    this.initVacationForm()
    this.initNewFirmForm();
    this.messages = [{ severity: 'success', summary: 'Success', detail: 'Firm created' }];
  }

  initAddressForm() {
    this.addressForm = this.fb.group({
      street: [
        "",
        [Validators.required, Validators.pattern(RegexPatterns.STREET_NAME)],
      ],
      number: [
        "",
        [Validators.required, Validators.pattern(RegexPatterns.STREET_NUMBER)],
      ],
      city: ["", Validators.required],
    });
  }

  initServicesArray() {
    this.servicesArray = this.fb.array([], Validators.required);
  }
  
  initVacationForm() {
    this.vacationForm = this.fb.group({
      start: [
        new Date(),
        [Validators.required],
      ],
      end: [
        new Date(),
        [Validators.required],
      ],
     
    });
  }

  initNewFirmForm() {
    this.newFirmForm = this.fb.group({
      name: ["", Validators.required],
      address: this.addressForm,
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(RegexPatterns.PHONE_NUMBER)],
      ],
      email: ["", [Validators.required, Validators.email]],
      reviewCount: [0],
      rating: [0],
      services: this.servicesArray,
      vacation: this.vacationForm,
    });
  }
  
  // Getters for addressForm
    get street() {
      return this.addressForm.get('street');
    }
  
    get number() {
      return this.addressForm.get('number');
    }
  
    get city() {
      return this.addressForm.get('city');
    }
  
    // Getters for vacationForm
    get start() {
      return this.vacationForm.get('start');
    }
  
    get end() {
      return this.vacationForm.get('end');
    }
  
    // Getters for newFirmForm
    get name() {
      return this.newFirmForm.get('name');
    }
  
    get phoneNumber() {
      return this.newFirmForm.get('phoneNumber');
    }
  
    get email() {
      return this.newFirmForm.get('email');
    }
  
    get reviewCount() {
      return this.newFirmForm.get('reviewCount');
    }
  
    get rating() {
      return this.newFirmForm.get('rating');
    }
    
    // Getters for service controls
    serviceName(index: number) {
      return this.servicesArray.at(index).get('name');
    }
  
    servicePrice(index: number) {
      return this.servicesArray.at(index).get('price');
    }
    
    get servicesForms() {
      return this.servicesArray as FormArray
    }

  addService() {
    const service = this.fb.group({
      name: ["", Validators.required],
      price: [0, Validators.required],
    });

    this.servicesArray.push(service);
  }
  
  deleteService(i: number) {
    this.servicesArray.removeAt(i);
  }


  onSubmit() {
    this.firmCreated = false;
    this.firmService.create(this.newFirmForm.value).subscribe((data) => {
      this.firmCreated = true;
    });
  }
}
