import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ClientesServiceService } from 'src/app/services/clientes/clientes-service.service';
import { CotizacionService } from 'src/app/services/cotizacion/cotizacion.service';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { ModalAddPagoComponent } from '../modal-add-pago/modal-add-pago.component';
import { PagosServiceService } from 'src/app/services/pagos/pagos-service.service';

@Component({
  selector: 'app-modal-cuenta',
  templateUrl: './modal-cuenta.component.html',
  styleUrls: ['./modal-cuenta.component.scss']
})
export class ModalCuentaComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<ModalCuentaComponent>,
      private alert: AlertService,
      private cotizacionService: CotizacionService,
      private clientesService: ClientesServiceService,
      private productosService: ProductosService, private dialog: MatDialog,private pagosService:PagosServiceService) { }


        pagos:any;
        total_pagos:number = 0;

        total_venta = 0;
        total = 0;
        clienesItems: any;
        productosItems: any = [];
        nombre_producto_search = '';
      
        contratoForm = new FormGroup({
          nombre: new FormControl(''),
          domicilio: new FormControl(''),
          busqueda: new FormControl(''),
          telefono: new FormControl(''),
          correo: new FormControl(''),
          total: new FormControl(this.total),
          total_venta: new FormControl(this.total_venta),
          clienteNuevo: new FormControl(true),
          id_cliente: new FormControl(true),
          tipo_pago: new FormControl(true),
          id_cotizacion: new FormControl(true),
      
          inversor: new FormControl(''),
          n_mod: new FormControl(''),
          modulo_fv: new FormControl(''),
          mat_montaje: new FormControl(''),
          s_fotovoltaico: new FormControl(''),
          tension: new FormControl(''),
          demanda_kw: new FormControl(''),
          inst_electrica: new FormControl(''),
          
          productos_cotizacion: this.fb.array([]),
        });
      
        productosFiltrados: any[] = [];
        productosSeleccionados: any[] = [];

        
   ngOnInit(): void {
    if (this.data.accion == 'editar' || this.data.accion == 'ver') {
      console.log('editar contrato tiene id')
      const { ...rest } = this.data;
      this.contratoForm.patchValue(rest);
       this.contratoForm.value.total = this.subTotal;
    this.contratoForm.value.total_venta = this.totalGeneral;
      this.productosCotizacion(rest.id_cotizacion)
    }
    this.clientes()

    this.getPagosByCotizacion()
    this.contratoForm.get('tipo_pago')?.disable();
  }

  get productosArray(): FormArray {
      return this.contratoForm.get('productos_cotizacion') as FormArray;
    }
  
    crearProductoFormGroup(producto: any): FormGroup {
      console.log(producto)
      return this.fb.group({
        id_producto: [producto.id_producto],
        nombre: [producto.nombre],
        precio: [producto.precio],
        precio_venta: [producto.precio],
        cantidad: [1],
        total: [producto.precio],  // precio inicial
        total_venta: [producto.precio],  // precio inicial
      });
    }
    // Agregar producto al FormArray
    agregarProducto(producto: any) {
      this.productosArray.push(this.crearProductoFormGroup(producto));
      this.nombre_producto_search = "";
      this.productosFiltrados = [];
    }
  
    // Recalcular total cuando cambia cantidad o precio
    calcularTotal(index: number) {
      const item = this.productosArray.at(index) as FormGroup;
  
      const cantidad = item.get('cantidad')!.value || 0;
      const precio = item.get('precio_venta')!.value || 0;
      const precio1 = item.get('precio')!.value || 0;
  
      item.get('total_venta')!.setValue(cantidad * precio);
      item.get('total')!.setValue(cantidad * precio1);
    }
  
    // Eliminar fila de producto
    eliminarProducto(index: number) {
      this.productosArray.removeAt(index);
    }
  
  
    get totalGeneral(): number {
      var total = this.productosArray.controls
        .map(c => c.get('total_venta')!.value)
        .reduce((acc, value) => acc + value, 0);
      this.total_venta = total;
      return total;
    }
  
    get subTotal(): number {
      var total = this.productosArray.controls
        .map(c => c.get('total')!.value)
        .reduce((acc, value) => acc + value, 0);
      this.total_venta = total;
      return total;
    }
  
    clientes() {
      this.clientesService.obtenerClientes().subscribe({
        next: (res: any) => {
          console.log(res);
          this.clienesItems = res;
        },
        error: (err: any) => {
          console.log('error', err);
        }
      });
    }
    productosCotizacion(id_cotizacion: any) {
      let data = {
        id: id_cotizacion
      }
      this.cotizacionService.productosCotizacion(data).subscribe({
        next: (res: any) => {
          console.log(res);
          this.productosArray.clear();
  
          // Verificar que vienen productos
          if (res && Array.isArray(res)) {
  
            res.forEach((p: any) => {
              this.productosArray.push(
                this.fb.group({
                  id_producto: [p.id_producto],
                  nombre: [p.nombre],
                  precio: [p.precio],
                  precio_venta: [p.precio_venta],
                  cantidad: [p.cantidad],
                  total: [p.total_partida],
                  total_venta: [p.total_partida_venta],
                })
              );
            });
          }
  this.subTotal;
  this.totalGeneral;
        },
        error: (err: any) => {
          console.log('error', err);
        }
      });
    }
  
    onClienteSeleccionado() {
      const id = this.contratoForm.get('id_cliente')?.value;
  
      if (!id) return;
  
      const cliente = this.clienesItems.find((c: { id_cliente: any; }) => c.id_cliente == id);
  
      if (cliente) {
        this.contratoForm.patchValue({
          nombre: cliente.nombre,
          telefono: cliente.telefono,
          correo: cliente.correo,
          domicilio: cliente.domicilio,
          id_cliente: cliente.id_cliente,
        });
      }
    }
  
    verificarTexto() {
      if (this.nombre_producto_search.length > 3) {
        this.productos();
      }
    }
  
    productos() {
      this.productosService.getProductosList(this.nombre_producto_search).subscribe({
        next: (res: any) => {
          console.log(res);
          this.productosItems = res;
        },
        error: (err: any) => {
          console.log('error', err);
        }
      });
    }
  
  
  
    onSubmit() {
      // TODO: Use EventEmitter with form value
      this.contratoForm.value.total = this.subTotal;
      this.contratoForm.value.total_venta = this.totalGeneral;
      console.log('entro', this.contratoForm.value);
  
      this.cotizacionService.addCotizacion(this.contratoForm.value).subscribe({
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
  
    actualizarContrato() {
  
       // TODO: Use EventEmitter with form value
       this.contratoForm.value.total = this.subTotal;
      this.contratoForm.value.total_venta = this.totalGeneral;
  
       console.log('entro', this.contratoForm.value);
       //this.pdfService.llenarContraprestacion(this.contratoForm.value)
       this.cotizacionService.updateCotizacion(this.contratoForm.value).subscribe({
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

      addPago(): void {
        var dialogRef = this.dialog.open(ModalAddPagoComponent, {
          width: '50%',
          data: this.data
        });
    
        dialogRef.afterClosed().subscribe(result => {
    
          if (result.event == 'Agregar') {
            this.getPagosByCotizacion();
          } else if (result.event == 'Cancel') {
            this.getPagosByCotizacion();
          }
    
        });
    
      }

      getPagosByCotizacion(){
        const data = {id: this.data.id_cotizacion}
         this.pagosService.getPagosByCotizacion(data).subscribe({
       next: (res: any) => {
         console.log(res);
         this.pagos = res.pagos;
         this.total_pagos = res.total.total_pagos;

         console.log(this.pagos)
         console.log(this.total_pagos)
       },
       error: (err: any) => {
         console.log('error', err);
       }
     });
      }

      get saldoActual(): number {
  return (this.totalGeneral || 0) - (this.total_pagos || 0);
}
  

}
