import { TestBed } from '@angular/core/testing';

import { DrawShapesService } from './draw-shapes.service';

describe('DrawShapesService', () => {
  let service: DrawShapesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawShapesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
