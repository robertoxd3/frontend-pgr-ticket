import { TestBed } from '@angular/core/testing';

import { VideocacheService } from './videocache.service';

describe('VideocacheService', () => {
  let service: VideocacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideocacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
