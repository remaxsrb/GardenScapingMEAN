import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerDashboardFirmsComponent } from './owner-dashboard-firms.component';

describe('OwnerDashboardFirmsComponent', () => {
  let component: OwnerDashboardFirmsComponent;
  let fixture: ComponentFixture<OwnerDashboardFirmsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerDashboardFirmsComponent]
    });
    fixture = TestBed.createComponent(OwnerDashboardFirmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
