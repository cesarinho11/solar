import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProveedorComponent } from './modal-proveedor.component';

describe('ModalProveedorComponent', () => {
  let component: ModalProveedorComponent;
  let fixture: ComponentFixture<ModalProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalProveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
