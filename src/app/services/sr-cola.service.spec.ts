import { TestBed } from '@angular/core/testing';

import { SrColaService } from './sr-cola.service';

describe('SrColaService', () => {
  let service: SrColaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrColaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
