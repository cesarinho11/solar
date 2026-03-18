import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMaterialInstalacionComponent } from './modal-material-instalacion.component';

describe('ModalMaterialInstalacionComponent', () => {
  let component: ModalMaterialInstalacionComponent;
  let fixture: ComponentFixture<ModalMaterialInstalacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMaterialInstalacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMaterialInstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
