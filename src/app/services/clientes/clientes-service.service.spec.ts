import { TestBed } from '@angular/core/testing';

import { ClientesServiceService } from './clientes-service.service';

describe('ClientesServiceService', () => {
  let service: ClientesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
