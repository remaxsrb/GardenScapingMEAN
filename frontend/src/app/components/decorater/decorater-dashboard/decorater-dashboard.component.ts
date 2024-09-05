import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/utilityServices/auth.service';

@Component({
  selector: 'app-decorater-dashboard',
  templateUrl: './decorater-dashboard.component.html',
  styleUrls: ['./decorater-dashboard.component.css']
})
export class DecoraterDashboardComponent {

  constructor(private auth_service: AuthService) {}

  logout() {
    localStorage.removeItem("user");
    this.auth_service.logout();
  }
}
