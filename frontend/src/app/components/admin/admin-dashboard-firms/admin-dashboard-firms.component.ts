import { Component, OnInit } from "@angular/core";
import { Firm } from "src/app/models/firm";
import { FirmService } from "src/app/services/modelServices/firm.service";
import { TimeService } from "src/app/services/utilityServices/time.service";

@Component({
  selector: "app-admin-dashboard-firms",
  templateUrl: "./admin-dashboard-firms.component.html",
  styleUrls: ["./admin-dashboard-firms.component.css"],
}) 
export class AdminDashboardFirmsComponent implements OnInit {
  constructor(
    private firmService: FirmService,
    private timeService: TimeService,
  ) {}

  firms: Firm[] = [];
  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = -1;
  totalDocuments: number = -1;

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.firmService
      .getDocuments(this.currentPage, this.limit, '')
      .subscribe((data) => {
        this.firms = data.firms;
        this.totalPages = data.totalPages;
        this.totalDocuments = data.totalDocuments;
      });
  }

  pageChange(event: any) {
    this.currentPage = event.first / event.rows + 1; // Calculate the current page
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
