import { Component, OnInit } from "@angular/core";
import { Owner } from "src/app/models/owner";
import { UserService } from "src/app/services/modelServices/user.service";

@Component({
  selector: "app-admin-dashboard-owners",
  templateUrl: "./admin-dashboard-owners.component.html",
  styleUrls: ["./admin-dashboard-owners.component.css"],
})
export class AdminDashboardOwnersComponent implements OnInit {
  constructor(private userService: UserService) {}
  owners: Owner[] = [];
  updatedOwnerStatuses: string[] = [];

  ngOnInit(): void {
    this.userService.findByRole("owner").subscribe((data) => {
      this.owners = data;
    });
    this.updatedOwnerStatuses.fill("");
  }

  updateStatus(owner: Owner, index: number): void {
    this.userService
      .updateStatus(owner._id, this.updatedOwnerStatuses[index])
      .subscribe((data) => {
        this.owners = [];

        this.userService.findByRole("owner").subscribe((data) => {
          this.owners = data;
        });
      });
  }
}
