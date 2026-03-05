import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ProductosService } from 'src/app/services/productos/productos.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.scss']
})
export class ModalProductoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<ModalProductoComponent>, private alert: AlertService, private productosService: ProductosService) { }

      title = 'producto';
      categoriaItems:any;

    productoForm = new FormGroup({
      id_producto: new FormControl(''),
     
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl(''),
      categoria: new FormControl('', Validators.required),
      categoria2: new FormControl('',  Validators.required),
      tipo: new FormControl(''),
      stock: new FormControl(''),
      stock_min: new FormControl(''),
      stock_max: new FormControl(''), //obtener de fecha
      costo: new FormControl(''),
      precio: new FormControl(''),
      potencia: new FormControl(''),
      marca: new FormControl(''),
      modelo: new FormControl(''),
      desc_mini: new FormControl(''),
      alerta: new FormControl(true),
      ultima_compra: new FormControl(''),
    });

  ngOnInit(): void {
    this.categorias_producto()
     if(this.data.accion == 'editar'){
      console.log('editar contrato tiene id')
      const { ...rest } = this.data;
      this.productoForm.patchValue(rest);
    }
  }

  
  getInvalidControls() {
    const invalid = [];
    const controls = this.productoForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }


   onSubmit() {

    const form: any = document.querySelector('form');

    if (this.productoForm.invalid) {
      console.log('entro')
      console.log('Campos inválidos:', this.getInvalidControls());
      this.productoForm.markAllAsTouched();
      this.alert.error('Revise los datos del formulario');
      return;
    }


    if (!form.checkValidity()) {
      form.reportValidity(); // Muestra la alerta del navegador
      return; // No avanza
    }


    // TODO: Use EventEmitter with form value
    console.log('entro', this.productoForm.value);
    //this.pdfService.llenarContraprestacion(this.contratoForm.value)
    this.productosService.addProducto(this.productoForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.dialogRef.close({ event: 'Agregar' });
        this.alert.success('El registro fue guardado correctamente');
      },
      error: (err: any) => {
        console.log('error', err);
        console.log('error', err.error.message);
         this.alert.error(err.error.message);
      }
    });
  }

  actualizarContrato(){
    
    
    const form: any = document.querySelector('form');

    if (this.productoForm.invalid) {
      console.log('entro')
      console.log('Campos inválidos:', this.getInvalidControls());
      this.productoForm.markAllAsTouched();
      this.alert.error('Revise los datos del formulario');
      return;
    }


    if (!form.checkValidity()) {
      form.reportValidity(); // Muestra la alerta del navegador
      return; // No avanza
    }

    // TODO: Use EventEmitter with form value
    console.log('entro', this.productoForm.value);
    //this.pdfService.llenarContraprestacion(this.contratoForm.value)
    this.productosService.editProducto(this.productoForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.dialogRef.close({ event: 'Agregar' });
        this.alert.success('El registro fue actualizado correctamente');
      },
      error: (err: any) => {
        console.log('error', err);
      }
    });
  }

  categorias_producto(){
    this.productosService.categoriasProducto().subscribe({
      next: (res: any) => {
        console.log(res);
        this.categoriaItems = res;
        console.log(this.categoriaItems)
      },
      error: (err: any) => {
        console.log('error', err);
      }
    });
  }

}
