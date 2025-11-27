import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

    productoForm = new FormGroup({
      id_producto: new FormControl(''),
      nombre: new FormControl(''),
      descripcion: new FormControl(''),
      categoria: new FormControl(''),
      tipo: new FormControl(''),
      stock: new FormControl(''),
      stock_min: new FormControl(''),
      stock_max: new FormControl(''), //obtener de fecha
      costo: new FormControl(''),
      precio: new FormControl('')
    });

  ngOnInit(): void {
     if(this.data.accion == 'editar'){
      console.log('editar contrato tiene id')
      const { ...rest } = this.data;
      this.productoForm.patchValue(rest);
    }
  }


   onSubmit() {
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
      }
    });
  }

  actualizarContrato(){
    
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

}
