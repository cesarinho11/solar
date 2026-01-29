import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { ProveedorService } from 'src/app/services/proveedor/proveedor.service';
import { ComprasService } from '../../services/compras/compras.service';

@Component({
  selector: 'app-modal-compras',
  templateUrl: './modal-compras.component.html',
  styleUrls: ['./modal-compras.component.scss']
})
export class ModalComprasComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalComprasComponent>,
    private alert: AlertService,
    private productosService: ProductosService, private proveedorService: ProveedorService, private comprasService: ComprasService) { }

  total_compra = 0;
  total = 0;
  clienesItems: any;
  productosItems: any = [];
  nombre_producto_search = '';

  contratoForm = new FormGroup({
    nombre: new FormControl(''),
    domicilio: new FormControl(''),
    sucursal: new FormControl(''),
    busqueda: new FormControl(''),
    lote: new FormControl(''),
    telefono: new FormControl(''),
    fecha: new FormControl(''),
    correo: new FormControl(''),
    total: new FormControl(this.total),
    total_compra: new FormControl(0),
    clienteNuevo: new FormControl(true),
    id_proveedor: new FormControl(true),
    tipo_pago: new FormControl(true),
    id_compra: new FormControl(true),

    productos_compra: this.fb.array([]),
  });

  productosFiltrados: any[] = [];
  productosSeleccionados: any[] = [];

  ngOnInit(): void {
    console.log('aaaa', this.data.accion)
    if (this.data.accion == 'editar' || this.data.accion == 'ver') {
      console.log('editar contrato tiene id')
      const { ...rest } = this.data;
      this.contratoForm.patchValue(rest);
      this.contratoForm.value.total = this.subTotal;
      this.contratoForm.value.total_compra = this.totalGeneral;
      this.productosCotizacion(rest.id_compra)
    }
    this.clientes()

    this.productosArray.valueChanges.subscribe(() => {
      this.actualizarTotalVenta();
    });
  }

  actualizarTotalVenta() {
    const totalGeneral = this.productosArray.controls.reduce((sum, item: any) => {
      return sum + (item.get('total_compra')?.value || 0);
    }, 0);

    this.contratoForm.patchValue({
      total_compra: totalGeneral
    }, { emitEvent: false });
  }

  verificarTexto() {
    if (this.nombre_producto_search.length > 2) {
      this.productos();
    }
  }

  onClienteSeleccionado() {
    const id = this.contratoForm.get('id_proveedor')?.value;

    if (!id) return;

    const cliente = this.clienesItems.find((c: { id_proveedor: any; }) => c.id_proveedor == id);

    if (cliente) {
      this.contratoForm.patchValue({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        correo: cliente.correo,
        domicilio: cliente.domicilio,
        id_proveedor: cliente.id_proveedor,
      });
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
    this.contratoForm.value.total_compra = this.totalGeneral;
    console.log('entro', this.contratoForm.value);

    this.comprasService.addCompra(this.contratoForm.value).subscribe({
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

  actualizarCompra() {

    // TODO: Use EventEmitter with form value
    this.contratoForm.value.total = this.subTotal;
    this.contratoForm.value.total_compra = this.totalGeneral;

    console.log('entro', this.contratoForm.value);

    this.comprasService.updateCompra(this.contratoForm.value).subscribe({
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

  get productosArray(): FormArray {
    return this.contratoForm.get('productos_compra') as FormArray;
  }

  crearProductoFormGroup(producto: any): FormGroup {
    console.log(producto)
    return this.fb.group({
      id_producto: [producto.id_producto],
      nombre: [producto.nombre],
      costo: [producto.costo],
      costo_compra: [producto.costo],
      cantidad: [1],
      total: [producto.costo],  // costo inicial
      total_compra: [producto.costo],  // costo inicial
      lote: 0,  // costo inicial
    });
  }
  // Agregar producto al FormArray
  agregarProducto(producto: any) {
    this.productosArray.push(this.crearProductoFormGroup(producto));
    this.nombre_producto_search = "";
    this.productosFiltrados = [];
  }

  // Recalcular total cuando cambia cantidad o costo
  calcularTotal(index: number) {
    const item = this.productosArray.at(index) as FormGroup;

    const cantidad = item.get('cantidad')!.value || 0;
    const costo = item.get('costo_compra')!.value || 0;
    const costo1 = item.get('costo')!.value || 0;

    item.get('total_compra')!.setValue(cantidad * costo);
    item.get('total')!.setValue(cantidad * costo1);
    console.log('entro')
    this.contratoForm.value.total_compra = this.totalGeneral;
  }

  // Eliminar fila de producto
  eliminarProducto(index: number) {
    this.productosArray.removeAt(index);
  }


  get totalGeneral(): number {
    var total = this.productosArray.controls
      .map((c: { get: (arg0: string) => any; }) => c.get('total_compra')!.value)
      .reduce((acc: any, value: any) => acc + value, 0);
    this.total_compra = total;
    return total;
  }

  get subTotal(): number {
    var total = this.productosArray.controls
      .map((c: { get: (arg0: string) => any; }) => c.get('total')!.value)
      .reduce((acc: any, value: any) => acc + value, 0);
    this.total_compra = total;
    return total;
  }

  clientes() {
    this.proveedorService.obtenerProveedores().subscribe({
      next: (res: any) => {
        console.log(res);
        this.clienesItems = res;
      },
      error: (err: any) => {
        console.log('error', err);
      }
    });
  }

  productosCotizacion(id_compra: any) {
    let data = {
      id: id_compra
    }
    this.comprasService.productosCompra(data).subscribe({
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
                costo: [p.costo],
                costo_compra: [p.costo_compra],
                cantidad: [p.cantidad],
                total: [p.total],
                total_compra: [p.total_compra],
                lote: [p.lote],
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

}
