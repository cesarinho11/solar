import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ClientesServiceService } from 'src/app/services/clientes/clientes-service.service';
import { CotizacionService } from 'src/app/services/cotizacion/cotizacion.service';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';

@Component({
  selector: 'app-modal-cotizacion',
  templateUrl: './modal-cotizacion.component.html',
  styleUrls: ['./modal-cotizacion.component.scss']
})
export class ModalCotizacionComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalCotizacionComponent>,
    private alert: AlertService,
    private cotizacionService: CotizacionService,
    private clientesService: ClientesServiceService,
    private productosService: ProductosService,
  private userService: UsuariosService) { }

  total_venta = 0;
  total = 0;
  clienesItems: any;
  vendedoresItems: any;
  productosItems: any = [];
  nombre_producto_search = '';

  cotizacionesForm = new FormGroup({
    vendedor: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    domicilio: new FormControl('', Validators.required),
    busqueda: new FormControl(''),
    telefono: new FormControl('', Validators.required),
    correo: new FormControl(''),
    total: new FormControl(this.total),
    total_venta: new FormControl(this.total_venta),
    clienteNuevo: new FormControl(true),
    id_cliente: new FormControl(true),
    tipo_pago: new FormControl('', Validators.required),
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
      this.cotizacionesForm.patchValue(rest);
       this.cotizacionesForm.value.total = this.subTotal;
    this.cotizacionesForm.value.total_venta = this.totalGeneral;
      this.productosCotizacion(rest.id_cotizacion)
    }
    this.clientes();
    this.vendedores();
  }

     getInvalidControls() {
    const invalid = [];
    const controls = this.cotizacionesForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }


  get productosArray(): FormArray {
    return this.cotizacionesForm.get('productos_cotizacion') as FormArray;
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

  vendedores() {
    this.userService.obtenerVendedores().subscribe({
      next: (res: any) => {
        console.log(res);
        this.vendedoresItems = res;
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
    const id = this.cotizacionesForm.get('id_cliente')?.value;

    if (!id) return;

    const cliente = this.clienesItems.find((c: { id_cliente: any; }) => c.id_cliente == id);

    if (cliente) {
      this.cotizacionesForm.patchValue({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        correo: cliente.correo,
        domicilio: cliente.domicilio,
        id_cliente: cliente.id_cliente,
      });
    }
  }

  verificarTexto() {
    if (this.nombre_producto_search.length > 1) {
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
   const form: any = document.querySelector('form');
     if (this.cotizacionesForm.invalid) {
      console.log('entro')
      console.log('Campos inválidos:', this.getInvalidControls());
      this.cotizacionesForm.markAllAsTouched();
      this.alert.error('Revise los datos del formulario');
      return;
    }


    if (!form.checkValidity()) {
      form.reportValidity(); // Muestra la alerta del navegador
      return; // No avanza
    }

    if(this.productosItems.length ==0){
      
      this.alert.warning('No hay productos seleccionados');
       return; // No avanza
    }

    // TODO: Use EventEmitter with form value
    this.cotizacionesForm.value.total = this.subTotal;
    this.cotizacionesForm.value.total_venta = this.totalGeneral;
    console.log('entro', this.cotizacionesForm.value);

    this.cotizacionService.addCotizacion(this.cotizacionesForm.value).subscribe({
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

  actualizarContrato() {

     // TODO: Use EventEmitter with form value
     this.cotizacionesForm.value.total = this.subTotal;
    this.cotizacionesForm.value.total_venta = this.totalGeneral;

     console.log('entro', this.cotizacionesForm.value);
     //this.pdfService.llenarContraprestacion(this.cotizacionesForm.value)
     this.cotizacionService.updateCotizacion(this.cotizacionesForm.value).subscribe({
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
