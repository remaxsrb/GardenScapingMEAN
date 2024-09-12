import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/modelServices/user.service';
import { JsonService } from 'src/app/services/utilityServices/json.service';
import { RegexPatterns } from '../../regexPatterns';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ImageValidationService } from 'src/app/services/utilityServices/image-validation-service.service';
import { FileService } from 'src/app/services/utilityServices/file.service';

type CardType = 'MASTERCARD' | 'VISA' | 'DINERS' | 'UNKNOWN';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  constructor(
    private jsonService: JsonService,
    private userService: UserService,
    private imageValidationService: ImageValidationService,
    private fb: FormBuilder,
    private fileService: FileService
  ) {}
  user: User = new User();
  addressForm!: FormGroup;
  userUpdateForm!: FormGroup;
  ccForm!: FormGroup;
  cardType: string = 'unknown'; // Default to unknown or adjust as necessary

  selectedFile: File | null = null;

  update_flags = {
    valid_picture_dimensions: true,
    email_taken: false,
    username_exists: false,
    general_errors: false,
  };

  ngOnInit(): void {
    const user_data = localStorage.getItem('user');
    if (user_data) {
      this.user = JSON.parse(user_data);
    }
    this.initAddressForm();
    this.initCCForm();
    this.initUserUpdateForm();
    this.userUpdateForm
      .get('creditCardNumber.cardNumber')
      ?.valueChanges.subscribe((value: string) => {
        this.cardType = this.getCardType(value);
      });
  }

  initAddressForm(): void {
    this.addressForm = this.fb.group({
      street: ['', [Validators.pattern(RegexPatterns.STREET_NAME)]],
      number: ['', [Validators.pattern(RegexPatterns.STREET_NUMBER)]],
      city: [''],
    });
  }

  initCCForm(): void {
    this.ccForm = this.fb.group({
      cardNumber: [
        '',
        [
          Validators.required,
          this.cardTypeValidator(RegexPatterns.cardPatterns),
        ],
      ],
    });
  }

  initUserUpdateForm(): void {
    this.userUpdateForm = this.fb.group({
      username: [''],
      email: ['', Validators.email],
      firstname: [''],
      lastname: [''],
      address: this.addressForm,
      phoneNumber: ['', [Validators.pattern(RegexPatterns.PHONE_NUMBER)]],
      creditCardNumber: this.ccForm,
      profilePhoto: [''],
    });
  }

  getCardType(cardNumber: string): string {
    // Remove non-numeric characters
    const cleanedCardNumber = cardNumber.replace(/\D/g, '');

    for (const [type, pattern] of Object.entries(RegexPatterns.cardPatterns)) {
      if (pattern.test(cleanedCardNumber)) {
        return type;
      }
    }
    return 'UNKNOWN'; // Default to 'unknown' if no match
  }

  getCardIcon(cardType: CardType): string {
    const icons: { [key in CardType]: string } = {
      MASTERCARD: 'assets/icons/mastercard.svg',
      VISA: 'assets/icons/visa.svg',
      DINERS: 'assets/icons/diners.svg',
      UNKNOWN: 'assets/icons/default.svg',
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
        pattern.test(cardNumber)
      );

      return valid ? null : { invalidCardType: true };
    };
  }

  get username() {
    return this.userUpdateForm.get('username');
  }

  get email() {
    return this.userUpdateForm.get('email');
  }
  get firstname() {
    return this.userUpdateForm.get('firstname');
  }
  get lastname() {
    return this.userUpdateForm.get('lastname');
  }
  get phoneNumber() {
    return this.userUpdateForm.get('phoneNumber');
  }
  get cardNumber() {
    return this.ccForm.get('cardNumber');
  }
  get profilePhoto() {
    return this.userUpdateForm.get('profilePhoto');
  }

  get street() {
    return this.addressForm.get('street');
  }
  get number() {
    return this.addressForm.get('number');
  }
  get city() {
    return this.addressForm.get('city');
  }

  onSubmit() {
    if (this.firstname!.value) {
      const data = {
        _id: this.user._id,
        firstname: this.firstname!.value,
      };
      this.userService.updateFirstname(data);
    }

    if (this.lastname!.value) {
      const data = {
        _id: this.user._id,
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
        _id: this.user._id,
        address: this.addressForm!.value,
      };
      this.userService.updateAddress(data);
    }
    if (this.phoneNumber!.value) {
      const data = {
        _id: this.user._id,
        phone_number: this.phoneNumber!.value,
      };
      this.userService.updatePhoneNumber(data);
    }
    if (this.cardNumber!.value) {
      const data = {
        _id: this.user._id,
        creditCardNumber: this.cardNumber!.value,
      };
      this.userService.updateCreditCardNumber(data);
    }

    this.userService.findByUsername(this.user.username).subscribe({
      next: (data) => {
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(data));
        window.location.reload();
      },
    });
  }

  validDimensions(image: File): Observable<boolean> {
    return this.imageValidationService.validateImageDimensions(image);
  }

  onFileSelected(event: any) {
    this.update_flags.valid_picture_dimensions = true;
    this.selectedFile = event.files[0]; // Store the actual File object
    this.imageValidationService
      .validateImageDimensions(this.selectedFile!)
      .subscribe((data) => {
        this.update_flags.valid_picture_dimensions = data;
      });
  }

  updatePhoto() {
    if (this.selectedFile) {
      console.log(this.selectedFile);

      this.fileService.uploadFile(this.selectedFile).subscribe((data) => {
        this.handleUpdateInDB();
      });
    }
  }

  private handleUpdateInDB() {
    this.fileService.uploadFile(this.selectedFile).subscribe((data) => {
      this.userUpdateForm.patchValue({
        profilePhoto: data.filePath,
      });

      const payload = {
        _id: this.user._id,
        profilePhoto: this.profilePhoto!.value,
      };

      this.userService.updateProfilePhoto(payload).subscribe({
        next: () => {
          this.refreshUserPhoto(data);
        },
      });
    });
  }

  private refreshUserPhoto(data: any) {
    localStorage.removeItem('user');

    this.user.profilePhoto = data.filePath;
    localStorage.setItem('user', JSON.stringify(this.user));
    window.location.reload();
  }
}
//profilePhoto
