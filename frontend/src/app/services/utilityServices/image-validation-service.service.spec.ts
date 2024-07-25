import { TestBed } from '@angular/core/testing';

import { ImageValidationServiceService } from './image-validation-service.service';

describe('ImageValidationServiceService', () => {
  let service: ImageValidationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageValidationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
