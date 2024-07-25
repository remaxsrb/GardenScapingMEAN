import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoraterDashboardComponent } from './decorater-dashboard.component';

describe('DecoraterDashboardComponent', () => {
  let component: DecoraterDashboardComponent;
  let fixture: ComponentFixture<DecoraterDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoraterDashboardComponent]
    });
    fixture = TestBed.createComponent(DecoraterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
