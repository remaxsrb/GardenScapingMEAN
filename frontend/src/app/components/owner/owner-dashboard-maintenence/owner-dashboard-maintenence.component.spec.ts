import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerDashboardMaintenenceComponent } from './owner-dashboard-maintenence.component';

describe('OwnerDashboardMaintenenceComponent', () => {
  let component: OwnerDashboardMaintenenceComponent;
  let fixture: ComponentFixture<OwnerDashboardMaintenenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerDashboardMaintenenceComponent]
    });
    fixture = TestBed.createComponent(OwnerDashboardMaintenenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
