import { Component } from "@angular/core";
import { AuthService } from "src/app/services/utilityServices/auth.service";

@Component({
  selector: "app-owner-dashboard",
  templateUrl: "./owner-dashboard.component.html",
  styleUrls: ["./owner-dashboard.component.css"],
})
export class OwnerDashboardComponent {
  constructor(private auth_service: AuthService) {}

  logout() {
    localStorage.removeItem("user");
    this.auth_service.logout();
  }
}
