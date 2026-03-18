import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ClientesServiceService } from 'src/app/services/clientes/clientes-service.service';
import { CotizacionService } from 'src/app/services/cotizacion/cotizacion.service';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';

@Component({
  selector: 'app-modal-material-instalacion',
  templateUrl: './modal-material-instalacion.component.html',
  styleUrls: ['./modal-material-instalacion.component.scss']
})
export class ModalMaterialInstalacionComponent implements OnInit {



  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalMaterialInstalacionComponent>,
    private alert: AlertService,
    private cotizacionService: CotizacionService,
    private productosService: ProductosService,
  ) { }

  mostrarLista: boolean = false;

  total_venta = 0;
  total = 0;
  clienesItems: any;
  vendedoresItems: any;
  productosItems: any = [];
  nombre_producto_search = '';

  cotizacionesForm = new FormGroup({

    nombre: new FormControl('', Validators.required),

    busqueda: new FormControl(''),

    id_cotizacion: new FormControl(true),


    productos_cotizacion: this.fb.array([]),
  });

  productosFiltrados: any[] = [];
  productosSeleccionados: any[] = [];


  ngOnInit(): void {
    this.cotizacionesForm.patchValue({
      nombre: this.data.name,
      id_cotizacion: this.data.id_cotizacion
    });


    if (this.data.accion == 'editar' || this.data.accion == 'ver') {
      console.log('editar contrato tiene id')
      const { ...rest } = this.data;
      this.cotizacionesForm.patchValue(rest);
      this.cotizacionesForm.value.total = this.subTotal;
      this.cotizacionesForm.value.total_venta = this.totalGeneral;
      this.productosCotizacion(rest.id_cotizacion)
    }
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
      precio: 0,
      precio_venta: 0,
      cantidad: [1],
      total: 0,  // precio inicial
      total_venta: 0,  // precio inicial
    });
  }
  // Agregar producto al FormArray
  // agregarProducto(producto: any) {
  //   this.productosArray.push(this.crearProductoFormGroup(producto));
  //   // this.nombre_producto_search = "";
  //   // this.productosFiltrados = [];
  // }

  agregarProducto(producto: any) {
    const productosArray = this.productosArray;

    // 🔍 Buscar si ya existe
    const index = productosArray.controls.findIndex(
      (control: any) => control.get('id_producto')?.value == producto.id_producto
    );

    if (index !== -1) {
      // ✅ Ya existe → sumar cantidad
      const control = productosArray.at(index);
      const cantidadActual = control.get('cantidad')?.value || 0;

      control.get('cantidad')?.setValue(cantidadActual + 1);

      // (opcional) recalcular total
      // this.calcularTotal(index);

    } else {
      // ✅ No existe → agregar nuevo
      productosArray.push(this.crearProductoFormGroup(producto));
    }
  }

  // Recalcular total cuando cambia cantidad o precio
  calcularTotal(index: number) {
    const item = this.productosArray.at(index) as FormGroup;

    const cantidad = item.get('cantidad')!.value || 0;
    const precio = 0;
    const precio1 = 0;
    // const precio = item.get('precio_venta')!.value || 0;
    // const precio1 = item.get('precio')!.value || 0;

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
      this.mostrarLista = true;
    }
  }

  cerrarLista() {
    this.mostrarLista = false;
  }

  estaSeleccionado(p: any): boolean {
    const productosArray = this.cotizacionesForm.get('productos_cotizacion') as FormArray;

    return productosArray.controls.some(
      (control: any) => control.get('id_producto')?.value === p.id_producto
    );
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

    if (this.productosItems.length == 0) {

      this.alert.warning('No hay productos seleccionados');
      return; // No avanza
    }

    // TODO: Use EventEmitter with form value
    this.cotizacionesForm.value.total = this.subTotal;
    this.cotizacionesForm.value.total_venta = this.totalGeneral;
    console.log('entro', this.cotizacionesForm.value);

    this.cotizacionService.agregarMaterialInstalacion(this.cotizacionesForm.value).subscribe({
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


}
