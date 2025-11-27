import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalCotizacionComponent } from 'src/app/modals/modal-cotizacion/modal-cotizacion.component';
import { CotizacionService } from 'src/app/services/cotizacion/cotizacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  constructor(private cotizacionService: CotizacionService, private dialog: MatDialog) { }

  tableColumns = [
    { key: 'id_cotizacion', label: 'ID Cotizacion' },
    { key: 'nombre', label: 'Cliente' },
    { key: 'domicilio_instalacion', label: 'domicilio_instalacion' },
    { key: 'telefono', label: 'telefono' },
    { key: 'total', label: 'total' },
    { key: 'total_venta', label: 'Total venta' },
  ];

  tableActions = [

    { label: 'Ver', icon: 'bi-eye', type: 'ver', class: 'btn btn-info' },
    { label: 'Confirmar', icon: 'bi-check-square', type: 'confirm', class: 'btn btn-primary' },
    { label: 'Eliminar', icon: 'bi-trash', type: 'delete', class: 'btn btn-danger' }
  ];
  tableData: any
  currentPage = 1;
  lastPage = 1;
  search = '';
  estatus = 0;

  ngOnInit(): void {
    this.loadProductos()
  }

  loadProductos(page: number = 1) {

    this.cotizacionService.getVentas(page, this.search, this.estatus).subscribe({
      next: (data) => {
        console.log(data)
        this.tableData = data.data;
        this.currentPage = data.current_page;
        this.lastPage = data.last_page;
      },
      error: (err) => {
        console.log('error al obtener usuarios')
      }
    })
  }


  cambiarPagina(page: number) {
    if (page >= 1 && page <= this.lastPage) {
      this.loadProductos(page);
    }
  }

  buscar() {
    this.loadProductos();
  }

  addCliente() {

  }

  onTableAction(event: { action: string; row: any }) {
    if (event.action === 'ver') {
      event.row.accion = event.action;
      console.log('ver →', event.row);
      let data = event.row;
      data.accion = 'ver'
      this.openDialog(data)

    } else if (event.action === 'confirm') {
      event.row.accion = event.action;
      console.log('Confirmar cotizacion →', event.row);
      this.confirmarCotizacion(event.row.id_cotizacion)

    }
    else if (event.action === 'delete') {
      event.row.accion = event.action;
      console.log('Eliminar →', event.row);
      this.cancelar(event.row.id_cotizacion)
    }
  }

  addProducto() {
    let data = { accion: 'nuevo' }
    this.openDialog(data)
  }


  filtro(tipo:number){
    this.estatus=tipo;
    this.loadProductos();
  }

            confirmarCotizacion(id_cotizacion: number) {
    Swal.fire({
      title: '¿Estás seguro de confirmar la cotizacion?',
      text: "",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
  
      if (result.isConfirmed) {
  
        // 👉 AQUÍ LLAMAS TU SERVICIO SI CONFIRMA
        let data = {id: id_cotizacion}
        this.cotizacionService.marcarPagada(data).subscribe({
          next: (res: any) => {
            Swal.fire('Confirmado', 'La cotización fue confirmada correctamente', 'success');
            console.log(res);
            this.loadProductos();
          },
          error: (err: any) => {
            Swal.fire('Error', 'No se pudo eliminar', 'error');
            console.log(err);
          }
        });
  
      }
    });
  }

  openDialog(data: any): void {
    var dialogRef = this.dialog.open(ModalCotizacionComponent, {
      width: '100%',
      data
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event == 'Agregar') {
        this.loadProductos();
      } else if (result.event == 'Cancel') {
        this.loadProductos();
      }

    });

  }

              cancelar(id_cotizacion: number) {
    Swal.fire({
      title: '¿Estás seguro de cancelar la venta?',
      text: "esta venta regresara a estatus de cotizacion",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
  
      if (result.isConfirmed) {
  
        // 👉 AQUÍ LLAMAS TU SERVICIO SI CONFIRMA
        let data = {id: id_cotizacion}
        this.cotizacionService.cancelarVenta(data).subscribe({
          next: (res: any) => {
            Swal.fire('Confirmado', 'La cotización fue confirmada correctamente', 'success');
            console.log(res);
            this.loadProductos();
          },
          error: (err: any) => {
            Swal.fire('Error', 'No se pudo eliminar', 'error');
            console.log(err);
          }
        });
  
      }
    });
  }

}
