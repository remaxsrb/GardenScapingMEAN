import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoraterDashboardStatisticsComponent } from './decorater-dashboard-statistics.component';

describe('DecoraterDashboardStatisticsComponent', () => {
  let component: DecoraterDashboardStatisticsComponent;
  let fixture: ComponentFixture<DecoraterDashboardStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoraterDashboardStatisticsComponent]
    });
    fixture = TestBed.createComponent(DecoraterDashboardStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
