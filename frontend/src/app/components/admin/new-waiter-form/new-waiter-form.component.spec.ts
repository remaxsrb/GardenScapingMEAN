import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWaiterFormComponent } from './new-waiter-form.component';

describe('NewWaiterFormComponent', () => {
  let component: NewWaiterFormComponent;
  let fixture: ComponentFixture<NewWaiterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewWaiterFormComponent]
    });
    fixture = TestBed.createComponent(NewWaiterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
