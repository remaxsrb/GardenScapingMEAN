import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoraterDashboardBookingsComponent } from './decorater-dashboard-bookings.component';

describe('DecoraterDashboardBookingsComponent', () => {
  let component: DecoraterDashboardBookingsComponent;
  let fixture: ComponentFixture<DecoraterDashboardBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoraterDashboardBookingsComponent]
    });
    fixture = TestBed.createComponent(DecoraterDashboardBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
