import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Message } from "primeng/api";
import { Observable } from "rxjs";
import { Firm } from "src/app/models/firm";
import { RegexPatterns } from "src/app/regexPatterns";
import { FirmService } from "src/app/services/modelServices/firm.service";
import { UserService } from "src/app/services/modelServices/user.service";
import { ImageValidationService } from "src/app/services/utilityServices/image-validation-service.service";

@Component({
  selector: "app-admin-dashboard-decorators",
  templateUrl: "./admin-dashboard-decorators.component.html",
  styleUrls: ["./admin-dashboard-decorators.component.css"],
})
export class AdminDashboardDecoratorsComponent implements OnInit {
  constructor(
    private userService: UserService,
    private firmService: FirmService,
    private imageValidationService: ImageValidationService,
    private fb: FormBuilder,
  ) {}

  firms: Firm[] = [];
  addressForm!: FormGroup;
  newDecoraterForm!: FormGroup;
  selectedFile: File | null = null;
  decoraterAdded: boolean = false;

  errorMessage: Message[] = [];
  
  signupResponseFlags = {
    emailOrUsernameTaken: false,
    generalErrors: false,
  };

  ngOnInit(): void {
    this.firmService.getIdName().subscribe((data) => {
      this.firms = data;
    });
    this.initAddressForm();
    this.initNewDecoraterForm();
  }

  initAddressForm(): void {
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

  initNewDecoraterForm() {
    this.newDecoraterForm = this.fb.group({
      username: ["", Validators.required],
      password: [
        "",
        [Validators.required, Validators.pattern(RegexPatterns.PASSWORD)],
      ],
      email: ["", [Validators.required, Validators.email]],
      role: ["decorater"],
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      gender: ["", Validators.required],
      address: this.addressForm,
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(RegexPatterns.PHONE_NUMBER)],
      ],
      profilePhoto: [""],
      firm: ["", Validators.required],
    });
  }
  
  get username() {
    return this.newDecoraterForm.get("username");
  }
  get password() {
    return this.newDecoraterForm.get("password");
  }
  get email() {
    return this.newDecoraterForm.get("email");
  }
  get gender() {
    return this.newDecoraterForm.get("gender");
  }
  get firstname() {
    return this.newDecoraterForm.get("firstname");
  }
  get lastname() {
    return this.newDecoraterForm.get("lastname");
  }
  get phoneNumber() {
    return this.newDecoraterForm.get("phoneNumber");
  }
  get profilePhoto() {
    return this.newDecoraterForm.get("profilePhoto");
  }
  get street() {
    return this.addressForm.get("street");
  }
  get number() {
    return this.addressForm.get("number");
  }
  get city() {
    return this.addressForm.get("city");
  }

  validDimensions(image: File): Observable<boolean> {
    return this.imageValidationService.validateImageDimensions(image);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.files[0]; // Store the actual File object
  }

  onSubmit() {
    if (this.selectedFile) {
      this.newDecoraterForm.patchValue({
        profilePhoto: this.selectedFile.name, // Assign file name to form
      });
    } else {
      // Set default profile photo based on gender
      this.newDecoraterForm.patchValue({
        profilePhoto:
          this.gender?.value === "male"
            ? "default_male.png"
            : "default_female.png",
      });
    }

    this.userService.register(this.newDecoraterForm.value).subscribe({
      next: () => {
      },
      error: (error) => {
        // Handle specific errors or show a general message
        if (error.status === 409) {
          this.signupResponseFlags.emailOrUsernameTaken = true;
          this.setErr(error.message);
        } else if (error.status === 500) {
          this.signupResponseFlags.generalErrors = true;
          this.setErr(error.message);
        } else {
          this.clearErr();
        }

        this.errorMessage = [
          { severity: "error", summary: "Error", detail: error.error?.message },
        ];
      },
    });
  }

  private setErr(message: string) {
    this.errorMessage = [
      { severity: "error", summary: "Error", detail: message },
    ];
  }

  private clearErr() {
    this.signupResponseFlags.emailOrUsernameTaken = false;
    this.signupResponseFlags.generalErrors = false;
    this.errorMessage = [];
  }
}
