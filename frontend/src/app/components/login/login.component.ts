import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Message } from 'primeng/api/message';
import { AuthService } from 'src/app/services/utilityServices/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private auth_service: AuthService,
    private router: Router,
    public jwtHelper: JwtHelperService,
    private fb: FormBuilder,

  ) {}

  ngOnInit() {
    this.initLoginForm();
  }

  private readonly TOKEN_KEY = 'authToken';

  logInForm! : FormGroup;
  errorMessage : Message[] = [];

  login_form_flags = {
    invalid_password: false,
    user_not_found: false,
    user_not_approved: false,
    general_errors: false,
    
  };

  initLoginForm(): void {
    this.logInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      
    });
  }

  get name() {
    return this.logInForm.get('username');
  }
  get password() {
    return this.logInForm.get('password');
  }

  private reset_form_flags() {
    this.login_form_flags.invalid_password = false;
    this.login_form_flags.user_not_found = false;
    this.login_form_flags.user_not_approved = false;
    this.login_form_flags.general_errors = false;

  }

  private setErr(message: string) {
    this.errorMessage = [
      { severity: 'error', summary: 'Error', detail: message },
    ];
  }

  onLogin() {
    this.reset_form_flags(); //Incase someone does not reload after bad submission, reset flags as to not confuse the user

    this.auth_service
      .login(this.logInForm.value)
      .subscribe({
        next: (data) => {
          localStorage.setItem(this.TOKEN_KEY, data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.user.role === 'guest') {
            this.router.navigate(['guest']);
          } else if (data.user.role === 'waiter') {
            this.router.navigate(['waiter']);
          } else if (data.user.role === 'admin') {
            //this.router.navigate(['admin']);

          } else {
            this.login_form_flags.general_errors = true;
          }
        },
        error: (error) => {

          if (error.status === 401) {
            this.login_form_flags.invalid_password = true;
          } else if (error.status === 403) {
            this.login_form_flags.user_not_approved = true;
          }else if (error.status === 404) {
            this.login_form_flags.user_not_found = true;
          } else if (error.status === 500){
            this.login_form_flags.general_errors = true;
          }
          else {
            this.reset_form_flags();
            this.errorMessage = [];
          }

          this.errorMessage = [
            { severity: 'error', summary: 'Error', detail: error.error?.message },
          ];
        },
      });
  }
}
