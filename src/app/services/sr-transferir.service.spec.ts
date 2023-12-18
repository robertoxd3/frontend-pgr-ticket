import { TestBed } from '@angular/core/testing';

import { SrTransferirService } from './sr-transferir.service';

describe('SrTransferirService', () => {
  let service: SrTransferirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrTransferirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
