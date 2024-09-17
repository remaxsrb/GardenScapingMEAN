import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Firm } from "src/app/models/firm";
import { FirmService } from "src/app/services/modelServices/firm.service";

@Component({
  selector: "app-owner-dashboard-firms",
  templateUrl: "./owner-dashboard-firms.component.html",
  styleUrls: ["./owner-dashboard-firms.component.css"],
})
export class OwnerDashboardFirmsComponent implements OnInit {
  constructor(private firmService: FirmService,
    private fb: FormBuilder

  ) {}
 
  firms: Firm[] = [];
  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = -1;
  number_of_firms: number = 0;

  sortingOrder: number = 1; //default ASC
  sortingField: string = "";

  searchForm!: FormGroup;

  
  ngOnInit(): void {
    this.initSearchForm();

    this.loadDocuments();
  }

  loadDocuments() {
    this.firmService
      .getDocuments(this.currentPage, this.limit, this.sortingField, this.sortingOrder)
      .subscribe((data) => {
        this.firms = data.firms;
        this.totalPages = data.totalPages;
        this.number_of_firms = data.totalDocuments;
      });
  }
  
  initSearchForm() {
    this.searchForm = this.fb.group({
      name: [''],
      address: [''],
    });
  }

  pageChange(event: any) {
    this.currentPage = event.first / event.rows + 1; // Calculate the current page
    this.limit = event.rows;
    this.loadDocuments();
  }

  sortChange(event: any) {
    this.currentPage = 1;
    this.sortingOrder = event.order;
    this.sortingField = event.field;
    this.loadDocuments();
  }

  isFirstPage() {
    return this.currentPage === 1;
  }

  isLastPage() {
    return this.currentPage === this.totalPages;
  }
  
  onLinkClick(firm: Firm) {
    localStorage.setItem('firm', JSON.stringify(firm));
  }

  get name() {
    return this.searchForm.get('name');
  }
  get address() {
    return this.searchForm.get('address');
  }

  search() {
    console.log(this.searchForm.value);
    const name = this.name?.value;
    let address = this.address?.value;
    let city = '';
    let street = '';
    let number = '';
    if (address !== '') {
      address = this.address?.value.split(',');
      street = address[0].split(' ')[0];
      number = address[0].split(' ')[1];
      if(number === undefined)
        number="";
      city = address[1];
      if(city === undefined)
        city=""
    }

    this.firmService
      .search(name, street, number, city, this.currentPage, this.limit)
      .subscribe((data) => {
        this.firms = data.firms;
        this.totalPages = data.totalPages;
        this.number_of_firms = data.totalDocuments;
      });
  }
  
}
