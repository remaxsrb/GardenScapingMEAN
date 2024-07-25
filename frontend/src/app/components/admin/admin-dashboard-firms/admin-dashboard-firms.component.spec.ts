import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardFirmsComponent } from './admin-dashboard-firms.component';

describe('AdminDashboardFirmsComponent', () => {
  let component: AdminDashboardFirmsComponent;
  let fixture: ComponentFixture<AdminDashboardFirmsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDashboardFirmsComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardFirmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
