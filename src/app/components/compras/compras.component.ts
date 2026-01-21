import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComprasComponent } from 'src/app/modals/modal-compras/modal-compras.component';
import { ComprasService } from 'src/app/services/compras/compras.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {

   constructor(private comprasService: ComprasService, private dialog: MatDialog) { }
  
    tableColumns = [
      { key: 'id_cliente', label: 'iD Cliente ' },
      { key: 'nombre', label: 'Cliente' },
      { key: 'domicilio', label: 'Domicilio' },
      { key: 'telefono', label: 'Teléfono' },
    ];
  
    tableActions = [
      { label: 'Editar', icon: 'bi-pencil-square', type: 'edit', class: 'btn btn-success' },
      { label: 'Contratos', icon: 'bi-file-pdf', type: 'contrato', class: 'btn btn-primary' },
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
      width: '70%',
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
      if (event.action === 'edit') {
        event.row.accion = event.action;
        console.log('Editar →', event.row);
  
      } else if (event.action === 'contrato') {
        event.row.accion = event.action;
        console.log('Contratos →', event.row);
  
      }
      else if (event.action === 'delete') {
        event.row.accion = event.action;
        console.log('Eliminar →', event.row);
      }
    }

}
