import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComprasComponent } from 'src/app/modals/modal-compras/modal-compras.component';
import { ComprasService } from 'src/app/services/compras/compras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {

   constructor(private comprasService: ComprasService, private dialog: MatDialog) { }
  
    tableColumns = [
      { key: 'id_compra', label: 'iD Compra ' },
      { key: 'nombre', label: 'Proveedor' },
      { key: 'domicilio', label: 'Domicilio' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'total', label: 'Total Compra' },
    ];
  
    tableActions = [
      { label: 'Ver', icon: 'bi-eye', type: 'ver', class: 'btn btn-primary' },
      { label: 'Editar', icon: 'bi-pencil-square', type: 'editar', class: 'btn btn-success' },
       { label: 'Confirmar compra', icon: 'bi-bag-check', type: 'confirm', class: 'btn btn-info' },
      // { label: 'Contratos', icon: 'bi-file-pdf', type: 'contrato', class: 'btn btn-primary' },
      { label: 'Eliminar', icon: 'bi-trash', type: 'delete', class: 'btn btn-danger' }
    ];
    tableData: any
    currentPage = 1;
    lastPage = 1;
    search = '';
  
    ngOnInit(): void {
      this.loadCompras()
    }
  
    loadCompras(page: number = 1) {
  
      this.comprasService.getCompras(page, this.search).subscribe({
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
        this.loadCompras(page);
      }
    }
  
    buscar() {
      this.loadCompras();
    }
  
  addCompra() {
    let data = { accion: 'nuevo' }
    this.openDialog(data)
  }


  openDialog(data: any): void {
    var dialogRef = this.dialog.open(ModalComprasComponent, {
      width: '90%',
      data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event == 'Agregar') {
         this.loadCompras();
      } else if (result.event == 'Cancel') {
         this.loadCompras();
      }

    });

  }
  
    onTableAction(event: { action: string; row: any }) {
      if (event.action === 'editar') {
        event.row.accion = event.action;
        console.log('Editar →', event.row);
        this.openDialog(event.row)
  
      } else if (event.action === 'confirm') {
        event.row.accion = event.action;
        console.log('confirm →', event.row);
        this.confirmarCompra(event.row.id_compra)
  
      }
      else if (event.action === 'delete') {
        event.row.accion = event.action;
        console.log('Eliminar →', event.row);
      }else if(event.action === 'ver'){
        event.row.accion = event.action;
        console.log('vewr →', event.row);
        this.openDialog(event.row)
      }
    }


      confirmarCompra(id_cotizacion: number) {
        Swal.fire({
          title: '¿Estás seguro de confirmar la compra?',
          text: "El inventario sera afectado despues de esta accion",
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Sí, confirmar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
    
          if (result.isConfirmed) {
    
            // 👉 AQUÍ LLAMAS TU SERVICIO SI CONFIRMA
            let data = { id: id_cotizacion }
            this.comprasService.confirmarCompra(data).subscribe({
              next: (res: any) => {
                Swal.fire('Confirmado', 'La cotización fue confirmada correctamente', 'success');
                console.log(res);
                this.loadCompras();
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
