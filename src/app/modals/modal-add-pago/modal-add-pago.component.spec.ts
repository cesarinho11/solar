import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPagoComponent } from './modal-add-pago.component';

describe('ModalAddPagoComponent', () => {
  let component: ModalAddPagoComponent;
  let fixture: ComponentFixture<ModalAddPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
