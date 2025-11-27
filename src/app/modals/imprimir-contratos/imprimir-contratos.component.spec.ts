import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirContratosComponent } from './imprimir-contratos.component';

describe('ImprimirContratosComponent', () => {
  let component: ImprimirContratosComponent;
  let fixture: ComponentFixture<ImprimirContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprimirContratosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimirContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
