import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReportesComponent } from './modal-reportes.component';

describe('ModalReportesComponent', () => {
  let component: ModalReportesComponent;
  let fixture: ComponentFixture<ModalReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
