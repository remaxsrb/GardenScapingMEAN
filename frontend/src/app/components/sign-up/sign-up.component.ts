import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "src/app/services/modelServices/user.service";
import { RegexPatterns } from "../../regexPatterns";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Message } from "primeng/api/message";
import { ImageValidationService } from "src/app/services/utilityServices/image-validation-service.service";
import { enviroment } from "src/app/env";

type CardType = "MASTERCARD" | "VISA" | "DINERS" | "UNKNOWN";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  addressForm!: FormGroup;
  ccForm!: FormGroup;
  selectedFile: File | null = null;
  cardType: string = "unknown"; // Default to unknown or adjust as necessary

  errorMessage: Message[] = [];

  captchaResponse: string | null = null;
  captchakey: string = enviroment.HCAPTCHAKEY;

  constructor(
    private userService: UserService,
    private imageValidationService: ImageValidationService,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initAddressForm();
    this.initCCForm();
    this.initSignUpForm();
    this.signUpForm
      .get("creditCardNumber.cardNumber")
      ?.valueChanges.subscribe((value: string) => {
        this.cardType = this.getCardType(value);
      });
  }
  
  initCCForm(): void {
    this.ccForm = this.fb.group({
      cardNumber: ['', [Validators.required,
      this.cardTypeValidator(RegexPatterns.cardPatterns)]]
    })
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

  initSignUpForm(): void {
    this.signUpForm = this.fb.group({
      username: ["", Validators.required],
      password: [
        "",
        [Validators.required, Validators.pattern(RegexPatterns.PASSWORD)],
      ],
      email: ["", [Validators.required, Validators.email]],
      role: ["owner"],
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      gender: ["", Validators.required],
      address: this.addressForm,
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(RegexPatterns.PHONE_NUMBER)],
      ],
      creditCardNumber: this.ccForm,
      profilePhoto: [""],
      status: ["pending"],
      captcha: ['', Validators.required]
    });
  }

  getCardType(cardNumber: string): string {
    // Remove non-numeric characters
    const cleanedCardNumber = cardNumber.replace(/\D/g, "");

    for (const [type, pattern] of Object.entries(RegexPatterns.cardPatterns)) {
      if (pattern.test(cleanedCardNumber)) {
        return type;
      }
    }
    return "UNKNOWN"; // Default to 'unknown' if no match
  }

  getCardIcon(cardType: CardType): string {
    const icons: { [key in CardType]: string } = {
      MASTERCARD: "assets/icons/mastercard.svg",
      VISA: "assets/icons/visa.svg",
      DINERS: "assets/icons/diners.svg",
      UNKNOWN: "assets/icons/default.svg",
    };

    return icons[cardType];
  }

  private cardTypeValidator(cardPatterns: {
    DINERS: RegExp;
    MASTERCARD: RegExp;
    VISA: RegExp;
  }): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
        return null; // No value, no validation
      }

      const cardNumber = control.value;
      const valid = Object.values(cardPatterns).some((pattern) =>
        pattern.test(cardNumber),
      );

      return valid ? null : { invalidCardType: true };
    };
  }

  get username() {
    return this.signUpForm.get("username");
  }
  get password() {
    return this.signUpForm.get("password");
  }
  get email() {
    return this.signUpForm.get("email");
  }
  get gender() {
    return this.signUpForm.get("gender");
  }
  get firstname() {
    return this.signUpForm.get("firstname");
  }
  get lastname() {
    return this.signUpForm.get("lastname");
  }
  get phoneNumber() {
    return this.signUpForm.get("phoneNumber");
  }
  get cardNumber() {
    return this.ccForm.get("cardNumber");
  }
  get profilePhoto() {
    return this.signUpForm.get("profilePhoto");
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

  signupResponseFlags = {
    emailOrUsernameTaken: false,
    generalErrors: false,
  };

  validDimensions(image: File): Observable<boolean> {
    return this.imageValidationService.validateImageDimensions(image);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.files[0]; // Store the actual File object
  }

  onSubmit() {
    if (this.selectedFile) {
      this.signUpForm.patchValue({
        profilePhoto: this.selectedFile.name, // Assign file name to form
      });
    } else {
      // Set default profile photo based on gender
      this.signUpForm.patchValue({
        profilePhoto:
          this.gender?.value === "male"
            ? "default_male.png"
            : "default_female.png",
      });
    }

    this.signUpForm.removeControl('captcha');
    
    //?Is backend captcha check necessary?

    this.userService.register(this.signUpForm.value).subscribe({
      next: () => {
        this.router.navigate(["/"]);
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

  onCaptchaSuccess(response: any): void {
    this.captchaResponse = response.token; 
    this.signUpForm.controls['captcha'].setValue(this.captchaResponse);
  }

  onCaptchaError(error: any): void {
    this.captchaResponse = null;
    this.signUpForm.controls['captcha'].setErrors({ 'captchaError': true });
  }

  onCaptchaExpired(): void {
    this.captchaResponse = null;
    this.signUpForm.controls['captcha'].setValue(null);
  }


}
