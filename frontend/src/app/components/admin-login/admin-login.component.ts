import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/services/utilityServices/auth.service';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent implements OnInit {
  constructor(
    private auth_service: AuthService,
    public jwtHelper: JwtHelperService,
    private router: Router,
    private fb: FormBuilder,

  ) {}

  private readonly TOKEN_KEY = 'authToken';

  logInForm! : FormGroup;

  ngOnInit() {
    this.initLoginForm();
  }
  initLoginForm(): void {
    this.logInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      
    });
  }

  get username() {
    return this.logInForm.get('username');
  }

  get password() {
    return this.logInForm.get('password');
  }

  onLogin() {
    this.auth_service
      .login(this.logInForm.value)
      .subscribe({
        next: (data) => {
          localStorage.setItem(this.TOKEN_KEY, data.token);

          if (data.user.role === 'admin') {
            this.router.navigate(['admin']);
          }
        },
        error: (error) => {
          console.error('Error logging in:', error);
          // Handle specific errors or show a general message
          if (error.status === 404) {
            console.log('Invalid credentials'); // Conflict error
          } else {
            console.log('Error logging in'); // General error
          }
        },
      });
  }
}
