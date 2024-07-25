import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/models/User";
import { UserService } from "src/app/services/modelServices/user.service";
import { JsonService } from "src/app/services/utilityServices/json.service";
import { RegexPatterns } from "../../regexPatterns";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ImageValidationService } from "src/app/services/utilityServices/image-validation-service.service";

type CardType = "MASTERCARD" | "VISA" | "DINERS" | "UNKNOWN";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  constructor(
    private jsonService: JsonService,
    private userService: UserService,
    private imageDim: ImageValidationService,
    private fb: FormBuilder,
  ) {}
  user: User = new User();
  addressForm!: FormGroup;
  userUpdateForm!: FormGroup;
  ccForm!: FormGroup;
  cardType: string = "unknown"; // Default to unknown or adjust as necessary

  selectedFile: File | null = null;

  update_flags = {
    invalid_picture_dimensions: false,
    email_taken: false,
    username_exists: false,
    general_errors: false,
  };

  ngOnInit(): void {
    const user_data = localStorage.getItem("user");
    if (user_data) {
      this.user = JSON.parse(user_data);
    }
    this.initAddressForm();
    this.initCCForm();
    this.initUserUpdateForm();
    this.userUpdateForm
      .get("creditCardNumber.cardNumber")
      ?.valueChanges.subscribe((value: string) => {
        this.cardType = this.getCardType(value);
      });

    this.jsonService.get_photo(this.user.profilePhoto).subscribe((data) => {
      this.user.profilePhoto = URL.createObjectURL(data);
    });
  }

  initAddressForm(): void {
    this.addressForm = this.fb.group({
      street: ["", [Validators.pattern(RegexPatterns.STREET_NAME)]],
      number: ["", [Validators.pattern(RegexPatterns.STREET_NUMBER)]],
      city: [""],
    });
  }

  initCCForm(): void {
    this.ccForm = this.fb.group({
      cardNumber: [
        "",
        [
          Validators.required,
          this.cardTypeValidator(RegexPatterns.cardPatterns),
        ],
      ],
    });
  }

  initUserUpdateForm(): void {
    this.userUpdateForm = this.fb.group({
      username: [""],
      email: ["", Validators.email],
      firstname: [""],
      lastname: [""],
      address: this.addressForm,
      phoneNumber: ["", [Validators.pattern(RegexPatterns.PHONE_NUMBER)]],
      creditCardNumber: this.ccForm,
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
    return this.userUpdateForm.get("username");
  }

  get email() {
    return this.userUpdateForm.get("email");
  }
  get firstname() {
    return this.userUpdateForm.get("firstname");
  }
  get lastname() {
    return this.userUpdateForm.get("lastname");
  }
  get phoneNumber() {
    return this.userUpdateForm.get("phoneNumber");
  }
  get cardNumber() {
    return this.ccForm.get("cardNumber");
  }
  get profilePhoto() {
    return this.userUpdateForm.get("profilePhoto");
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
    return this.imageDim.validateImageDimensions(image);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }

  onSubmit() {
    if (this.firstname!.value) {
      const data = {
        username: this.user.username,
        firstname: this.firstname!.value,
      };
      this.userService.updateFirstname(data);
    }

    if (this.lastname!.value) {
      const data = {
        username: this.user.username,
        lastname: this.lastname!.value,
      };
      this.userService.updateLastname(data);
    }

    if (this.username!.value) {
      this.userService.updateUsername(this.username!.value).subscribe({
        error: (error) => {
          // Handle specific errors or show a general message
          if (error.status === 408) {
            this.update_flags.username_exists = true;
            // Conflict error
          } else {
            this.update_flags.general_errors = true; // General error
          }
        },
      });
    }
    if (this.email!.value) {
      this.userService.updateEmail(this.email!.value).subscribe({
        error: (error) => {
          // Handle specific errors or show a general message
          if (error.status === 409) {
            this.update_flags.email_taken = true;
            // Conflict error
          } else {
            this.update_flags.general_errors = true; // General error
          }
        },
      });
    }
    if (this.addressForm!.value) {
      const data = {
        username: this.user.username,
        address: this.addressForm!.value,
      };
      this.userService.updateAddress(data);
    }
    if (this.phoneNumber!.value) {
      const data = {
        username: this.user.username,
        phone_number: this.phoneNumber!.value,
      };
      this.userService.updatePhoneNumber(data);
    }
    if (this.cardNumber!.value) {
      const data = {
        username: this.user.username,
        creditCardNumber: this.cardNumber!.value,
      };
      this.userService.updateCreditCardNumber(data);
    }

    this.userService.findByUsername(this.user.username).subscribe({
      next: (data) => {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(data));
        window.location.reload();
      },
    });
  }

  updatePhoto() {
    this.update_flags.invalid_picture_dimensions = false;

    if (this.selectedFile) {
      this.userUpdateForm.patchValue({
        profile_photo: this.selectedFile.name, // Assign file name to plan in form
      });
      const data = {
        username: this.username!.value,
        profilePhoto: this.profilePhoto!.value,
      };
      this.userService.updateProfilePhoto(data).subscribe({
        next: () => {
          this.userService.findByUsername(this.user.username).subscribe({
            next: (data) => {
              localStorage.removeItem("user");
              localStorage.setItem("user", JSON.stringify(data));
              window.location.reload();
            },
          });
        },
      });
    }
  }
}
