import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardDecoratersComponent } from './admin-dashboard-decoraters.component';

describe('AdminDashboardDecoratersComponent', () => {
  let component: AdminDashboardDecoratersComponent;
  let fixture: ComponentFixture<AdminDashboardDecoratersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDashboardDecoratersComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardDecoratersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
