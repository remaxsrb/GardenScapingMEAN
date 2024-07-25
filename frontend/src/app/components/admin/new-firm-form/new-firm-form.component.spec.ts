import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFirmFormComponent } from './new-firm-form.component';

describe('NewFirmFormComponent', () => {
  let component: NewFirmFormComponent;
  let fixture: ComponentFixture<NewFirmFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewFirmFormComponent]
    });
    fixture = TestBed.createComponent(NewFirmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
