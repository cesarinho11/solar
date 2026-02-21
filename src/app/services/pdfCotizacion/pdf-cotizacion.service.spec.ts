import { TestBed } from '@angular/core/testing';

import { PdfCotizacionService } from './pdf-cotizacion.service';

describe('PdfCotizacionService', () => {
  let service: PdfCotizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfCotizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
