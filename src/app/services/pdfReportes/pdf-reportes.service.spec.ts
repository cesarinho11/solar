import { TestBed } from '@angular/core/testing';

import { PdfReportesService } from './pdf-reportes.service';

describe('PdfReportesService', () => {
  let service: PdfReportesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfReportesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
