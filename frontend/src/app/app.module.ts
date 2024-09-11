import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

//Prime NG modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { StepsModule } from 'primeng/steps';
import { CheckboxModule } from 'primeng/checkbox';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';

// Third-party Modules
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';

// My Components and services
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardDecoratorsComponent } from './components/admin/admin-dashboard-decorators/admin-dashboard-decorators.component';
import { AdminDashboardFirmsComponent } from './components/admin/admin-dashboard-firms/admin-dashboard-firms.component';
import { AdminDashboardOwnersComponent } from './components/admin/admin-dashboard-owners/admin-dashboard-owners.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { NewFirmFormComponent } from './components/admin/new-firm-form/new-firm-form.component';
import { NewWaiterFormComponent } from './components/admin/new-waiter-form/new-waiter-form.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DecoraterDashboardBookingsComponent } from './components/decorater/decorater-dashboard-bookings/decorater-dashboard-bookings.component';
import { DecoraterDashboardMaintenenceComponent } from './components/decorater/decorater-dashboard-maintenence/decorater-dashboard-maintenence.component';
import { DecoraterDashboardStatisticsComponent } from './components/decorater/decorater-dashboard-statistics/decorater-dashboard-statistics.component';
import { DecoraterDashboardComponent } from './components/decorater/decorater-dashboard/decorater-dashboard.component';
import { FirmComponent } from './components/firm/firm.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { OwnerDashboardBookingsComponent } from './components/owner/owner-dashboard-bookings/owner-dashboard-bookings.component';
import { OwnerDashboardFirmsComponent } from './components/owner/owner-dashboard-firms/owner-dashboard-firms.component';
import { OwnerDashboardMaintenenceComponent } from './components/owner/owner-dashboard-maintenence/owner-dashboard-maintenence.component';
import { OwnerDashboardComponent } from './components/owner/owner-dashboard/owner-dashboard.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/utilityServices/auth.service';

import {environment } from './env';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    SignUpComponent,
    FirmComponent,
    ChangePasswordComponent,
    AdminLoginComponent,
    NewFirmFormComponent,
    NewWaiterFormComponent,
    AdminDashboardComponent,
    AdminDashboardFirmsComponent,
    AdminDashboardDecoratorsComponent,
    AdminDashboardOwnersComponent,
    UserProfileComponent,
    OwnerDashboardComponent,
    OwnerDashboardFirmsComponent,
    OwnerDashboardBookingsComponent,
    OwnerDashboardMaintenenceComponent,
    DecoraterDashboardComponent,
    DecoraterDashboardBookingsComponent,
    DecoraterDashboardMaintenenceComponent,
    DecoraterDashboardStatisticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CalendarModule,
    RatingModule,
    DropdownModule,
    InputTextModule,
    FileUploadModule,
    TableModule,
    RadioButtonModule,
    MessageModule,
    MessagesModule,
    PasswordModule,
    SelectButtonModule,
    StepsModule,
    CheckboxModule,
    ChartModule,
    DialogModule,
    GalleriaModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('access_token'),
        allowedDomains: ['http://127.0.0.1:4000/'],
      },
    }),
  ],
  providers: [
    AuthService,
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: environment.SITEKEY } as RecaptchaSettings, // Replace with your actual site key
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
