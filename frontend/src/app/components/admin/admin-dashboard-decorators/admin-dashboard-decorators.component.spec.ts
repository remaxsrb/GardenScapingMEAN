import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardDecoratorsComponent } from './admin-dashboard-decorators.component';

describe('AdminDashboardDecoratersComponent', () => {
  let component: AdminDashboardDecoratorsComponent;
  let fixture: ComponentFixture<AdminDashboardDecoratorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDashboardDecoratorsComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardDecoratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
