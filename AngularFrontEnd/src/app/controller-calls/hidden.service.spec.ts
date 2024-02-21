import { TestBed } from '@angular/core/testing';

import { HiddenService } from './hidden.service';

describe('HiddenService', () => {
  let service: HiddenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiddenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
