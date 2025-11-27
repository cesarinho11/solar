import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCotizacionComponent } from './modal-cotizacion.component';

describe('ModalCotizacionComponent', () => {
  let component: ModalCotizacionComponent;
  let fixture: ComponentFixture<ModalCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
