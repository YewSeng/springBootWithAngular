import { TestBed } from '@angular/core/testing';

import { UnauthorizedAccessService } from './unauthorized-access.service';

describe('UnauthorizedAccessService', () => {
  let service: UnauthorizedAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnauthorizedAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
