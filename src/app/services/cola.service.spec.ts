import { TestBed } from '@angular/core/testing';

import { ColaService } from './cola.service';

describe('ColaService', () => {
  let service: ColaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
