import { Component, OnInit } from "@angular/core";
import { Firm } from "src/app/models/firm";
import { FirmService } from "src/app/services/modelServices/firm.service";

@Component({
  selector: "app-owner-dashboard-firms",
  templateUrl: "./owner-dashboard-firms.component.html",
  styleUrls: ["./owner-dashboard-firms.component.css"],
})
export class OwnerDashboardFirmsComponent implements OnInit {
  constructor(private firmService: FirmService) {}

  firms: Firm[] = [];
  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = -1;
  number_of_firms: number = 0;

  ngOnInit(): void {
    //this.loadDocuments();
  }

  // loadDocuments() {
  //   this.firmService
  //     .getDocuments(this.currentPage, this.limit)
  //     .subscribe((data) => {
  //       this.firms = data.firms;
  //       this.totalPages = data.totalPages;
  //       this.number_of_firms = data.totalDocuments;
  //     });
  // }

  // pageChange(event: any) {
  //   this.currentPage = event.first / event.rows + 1; // Calculate the current page
  //   this.limit = event.rows;
  //   this.loadDocuments();
  // }

  // sortChange(event: any) {
  //   this.firmService
  //     .sortPaginated(event.field, event.order, this.currentPage, this.limit)
  //     .subscribe((data) => {
  //       this.firms = data;
  //     });
  // }

  // isFirstPage() {
  //   return this.currentPage === 1;
  // }

  // isLastPage() {
  //   return this.currentPage === this.totalPages;
  // }
}
