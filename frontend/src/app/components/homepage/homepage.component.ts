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

  sortingOrder: number = 0;
  sortingField: string = "";

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

  sortDocuments() {
    this.currentPage = 1;
    this.firmService
      .sortPaginated(
        this.sortingField,
        this.sortingOrder,
        this.currentPage,
        this.limit,
      )
      .subscribe((data) => {
        this.firms = data;
      });
  }

  pageChange(event: any) {
    this.currentPage = event.first / event.rows + 1; // Calculate the current page
    this.limit = event.rows;
    this.loadDocuments();
  }

  sortChange(event: any) {
    this.sortingOrder = event.order;
    this.sortingField = event.field;
    this.sortDocuments();
  }

  isFirstPage() {
    return this.currentPage === 1;
  }

  isLastPage() {
    return this.currentPage === this.totalPages;
  }
}
