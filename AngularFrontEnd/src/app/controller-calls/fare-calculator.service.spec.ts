import { TestBed } from '@angular/core/testing';

import { FareCalculatorService } from './fare-calculator.service';

describe('FareCalculatorService', () => {
  let service: FareCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FareCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
