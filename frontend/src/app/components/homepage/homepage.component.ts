import { Component, OnInit } from "@angular/core";
import { Firm } from "src/app/models/firm";
import { FirmService } from "src/app/services/modelServices/firm.service";
import { UserService } from "src/app/services/modelServices/user.service";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.css"],
})
export class HomepageComponent implements OnInit {
  constructor(
    private firmService: FirmService,
    private userService: UserService,
  ) {}

  number_of_firms: number = 0;
  number_of_owners: number = 0;

  firms: Firm[] = [];
  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = -1;

  ngOnInit(): void {
    this.userService.countOwner().subscribe((data) => {
      this.number_of_owners = data.count;
    });

    this.loadDocuments();
  }

  loadDocuments() {
    this.firmService
      .getDocuments(this.currentPage, this.limit)
      .subscribe((data) => {
        this.firms = data.firms;
        this.totalPages = data.totalPages;
        this.number_of_firms = data.totalDocuments;
      });
  }

  pageChange(event: any) {
    this.currentPage = event.page + 1; // PrimeNG is zero-indexed, so increment by 1
    this.limit = event.rows;
    this.loadDocuments();
  }

  isFirstPage() {
    return this.currentPage === 1;
  }

  isLastPage() {
    return this.currentPage === this.totalPages;
  }
}
