import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoraterDashboardMaintenenceComponent } from './decorater-dashboard-maintenence.component';

describe('DecoraterDashboardMaintenenceComponent', () => {
  let component: DecoraterDashboardMaintenenceComponent;
  let fixture: ComponentFixture<DecoraterDashboardMaintenenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoraterDashboardMaintenenceComponent]
    });
    fixture = TestBed.createComponent(DecoraterDashboardMaintenenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
