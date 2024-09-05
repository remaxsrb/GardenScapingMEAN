import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnerDashboardFirmsComponent } from './components/owner/owner-dashboard-firms/owner-dashboard-firms.component';
import { OwnerDashboardBookingsComponent } from './components/owner/owner-dashboard-bookings/owner-dashboard-bookings.component';
import { OwnerDashboardMaintenenceComponent } from './components/owner/owner-dashboard-maintenence/owner-dashboard-maintenence.component';
import { FirmComponent } from './components/firm/firm.component';
import { AdminDashboardFirmsComponent } from './components/admin/admin-dashboard-firms/admin-dashboard-firms.component';
import { AdminDashboardDecoratorsComponent } from './components/admin/admin-dashboard-decorators/admin-dashboard-decorators.component';
import { AdminDashboardOwnersComponent } from './components/admin/admin-dashboard-owners/admin-dashboard-owners.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DecoraterDashboardComponent } from './components/decorater/decorater-dashboard/decorater-dashboard.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { OwnerDashboardComponent } from './components/owner/owner-dashboard/owner-dashboard.component';
import { DecoraterDashboardStatisticsComponent } from './components/decorater/decorater-dashboard-statistics/decorater-dashboard-statistics.component';
import { DecoraterDashboardBookingsComponent } from './components/decorater/decorater-dashboard-bookings/decorater-dashboard-bookings.component';
import { DecoraterDashboardMaintenenceComponent } from './components/decorater/decorater-dashboard-maintenence/decorater-dashboard-maintenence.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'admin_login', component: AdminLoginComponent },
  {
    path: 'owner',
    component: OwnerDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expected_role: 'owner' },
    children: [
      { path: 'firms', component: OwnerDashboardFirmsComponent},
      { path: 'bookings', component: OwnerDashboardBookingsComponent },
      { path: 'maintenence', component: OwnerDashboardMaintenenceComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }, 
    ]
  },
  { path: 'firmInfo', component: FirmComponent},

  {
    path: 'decorator',
    component: DecoraterDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expected_role: 'decorator' },
    children: [
      { path: 'statistics', component: DecoraterDashboardStatisticsComponent},
      { path: 'bookings', component: DecoraterDashboardBookingsComponent },
      { path: 'maintenence', component: DecoraterDashboardMaintenenceComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }, 
    ]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expected_role: 'admin' },
    children: [
      { path: 'firms', component: AdminDashboardFirmsComponent },
      { path: 'decorators', component: AdminDashboardDecoratorsComponent },
      { path: 'owners', component: AdminDashboardOwnersComponent },
      { path: '', redirectTo: 'firms', pathMatch: 'full' }, 
    ]
  },

  { path: 'change_password', component: ChangePasswordComponent },
  
  {
    path: 'owner/firmInfo',
    component: FirmComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expected_role: 'owner' },
  },
  { path: '**', redirectTo: '404', pathMatch: 'full' }, //Error route
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
