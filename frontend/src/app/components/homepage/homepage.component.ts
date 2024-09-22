import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking } from 'src/app/models/booking';
import { Decorator } from 'src/app/models/decorator';
import { Firm } from 'src/app/models/firm';
import { RegexPatterns } from 'src/app/regexPatterns';
import { BookingService } from 'src/app/services/modelServices/booking.service';
import { FirmService } from 'src/app/services/modelServices/firm.service';
import { UserService } from 'src/app/services/modelServices/user.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  constructor(
    private firmService: FirmService,
    private userService: UserService,
    private bookingService: BookingService,
    private fb: FormBuilder
  ) {}

  number_of_firms: number = 0;
  number_of_owners: number = 0;
  pastDayCount: number = 0;
  pastWeekCount: number = 0;
  pastMonthCount: number = 0;

  decorators: Decorator[] = [];

  sortingOrder: number = 1; //default sorting order is ASC
  sortingField: string = '';

  firms: Firm[] = [];
  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = -1;

  selectedFirm: Firm = new Firm();

  addressString: string = 'street number,city';

  searchForm!: FormGroup;

  jobPhotos: string[] = [];
  responsiveOptions: any[] | undefined;

  ngOnInit(): void {
    this.userService.countOwner().subscribe((data) => {
      this.number_of_owners = data.count;
    });

    this.userService.findByRole('decorator').subscribe((data) => {
      this.decorators = data;
    });

    this.bookingService.getPastDayCount().subscribe((data) => {
      this.pastDayCount = data;
    });

    this.bookingService.getPastWeekCount().subscribe((data) => {
      this.pastWeekCount = data;
    });

    this.bookingService.getPastMonthCount().subscribe((data) => {
      this.pastMonthCount = data;
    });

    this.bookingService.latest_photos().subscribe((data) => {
      data.forEach((element: Booking) => {
        this.jobPhotos!.push(element.photo);
      });
    });
    this.initResponsiveOptions();
    this.initSearchForm();
    this.loadDocuments();
  }

  initResponsiveOptions() {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5,
      },
      {
        breakpoint: '768px',
        numVisible: 3,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
      },
    ];
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      name: [''],
      address: [''],
    });
  }

  refreshData() {
    this.currentPage = 1;
    this.sortingOrder = 1;
    this.sortingField = '';
    this.loadDocuments();
  }

  loadDocuments() {
    this.firmService
      .getDocuments(
        this.currentPage,
        this.limit,
        this.sortingField,
        this.sortingOrder
      )
      .subscribe((data) => {
        this.firms = data.firms;
        this.totalPages = data.totalPages;
        this.number_of_firms = data.totalDocuments;
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
