import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerDashboardBookingsComponent } from './owner-dashboard-bookings.component';

describe('OwnerDashboardBookingsComponent', () => {
  let component: OwnerDashboardBookingsComponent;
  let fixture: ComponentFixture<OwnerDashboardBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerDashboardBookingsComponent]
    });
    fixture = TestBed.createComponent(OwnerDashboardBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
