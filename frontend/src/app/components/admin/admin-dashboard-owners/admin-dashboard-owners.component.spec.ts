import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardOwnersComponent } from './admin-dashboard-owners.component';

describe('AdminDashboardOwnersComponent', () => {
  let component: AdminDashboardOwnersComponent;
  let fixture: ComponentFixture<AdminDashboardOwnersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDashboardOwnersComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
