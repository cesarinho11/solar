import { TestBed } from '@angular/core/testing';

import { PagosServiceService } from './pagos-service.service';

describe('PagosServiceService', () => {
  let service: PagosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
