import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Decorator } from "src/app/models/decorator";
import { Firm } from "src/app/models/firm";
import { RegexPatterns } from "src/app/regexPatterns";
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
    private fb: FormBuilder,
  ) {}

  number_of_firms: number = 0;
  number_of_owners: number = 0;
  
  decorators: Decorator[] = []

  sortingOrder: number = 1; //default sorting order is ASC
  sortingField: string = "";

  firms: Firm[] = [];
  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = -1;
  
  selectedFirm: Firm = new Firm()


  addressString: string = "street number,city";

  searchForm!: FormGroup;

  ngOnInit(): void {
    this.userService.countOwner().subscribe((data) => {
      this.number_of_owners = data.count;
    });
    
    this.userService.findByRole('decorator').subscribe((data) => {
          this.decorators = data;
        });
    
    this.initSearchForm();
    this.loadDocuments();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      name: [""],
      address:[this.addressString]
    });
  }

  applyFilters() {
    // this.firmService.readByFields().subscribe((data) => {
    //   this.firms = data;
    // })
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

  // sortDocuments() {
  //   this.firmService
  //     .sortPaginated(
  //       this.sortingField,
  //       this.sortingOrder,
  //       this.currentPage,
  //       this.limit,
  //     )
  //     .subscribe((data) => {
  //       this.firms = data;
  //     });
  // }

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
}
