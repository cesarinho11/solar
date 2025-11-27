import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGenerarContratosComponent } from './modal-generar-contratos.component';

describe('ModalGenerarContratosComponent', () => {
  let component: ModalGenerarContratosComponent;
  let fixture: ComponentFixture<ModalGenerarContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalGenerarContratosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGenerarContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
