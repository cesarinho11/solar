import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalClienteComponent } from 'src/app/modals/modal-cliente/modal-cliente.component';
import { ClientesServiceService } from 'src/app/services/clientes/clientes-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  constructor(private clientesService: ClientesServiceService, private dialog: MatDialog) { }

  tableColumns = [
    { key: 'id_cliente', label: 'iD Cliente ' },
    { key: 'nombre', label: 'Cliente' },
    { key: 'domicilio', label: 'Domicilio' },
    { key: 'telefono', label: 'Teléfono' },
  ];

  tableActions = [
    { label: 'Editar', icon: 'bi-pencil-square', type: 'edit', class: 'btn btn-success' },
    { label: 'Eliminar', icon: 'bi-trash', type: 'delete', class: 'btn btn-danger' }
  ];
  tableData: any
  currentPage = 1;
  lastPage = 1;
  search = '';

  ngOnInit(): void {
    this.loadClientes()
  }

  loadClientes(page: number = 1) {

    this.clientesService.getClientes(page, this.search).subscribe({
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
      this.loadClientes(page);
    }
  }

  buscar() {
    this.loadClientes();
  }

  addCliente() {
let data = { accion: 'nuevo' }
    this.openDialog(data)
  }

  onTableAction(event: { action: string; row: any }) {
    if (event.action === 'edit') {
      event.row.accion = event.action;
      console.log('Editar →', event.row);
      let data = event.row;
      data.accion = 'editar'
      this.openDialog(data)

    } else if (event.action === 'contrato') {
      event.row.accion = event.action;
      console.log('Contratos →', event.row);

    }
    else if (event.action === 'delete') {
      event.row.accion = event.action;
      console.log('Eliminar →', event.row);
      this.eliminar( event.row.id_cliente);
    }
  }

                eliminar(id_cotizacion: number) {
      Swal.fire({
        title: '¿Estás seguro de eliminar el cliente?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
    
        if (result.isConfirmed) {
    
          // 👉 AQUÍ LLAMAS TU SERVICIO SI CONFIRMA
          let data = {id: id_cotizacion}
          this.clientesService.deleteCliente(data).subscribe({
            next: (res: any) => {
              Swal.fire('Confirmado', 'El cliente fue eliminado correctamente', 'success');
              console.log(res);
              this.loadClientes();
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
                var dialogRef = this.dialog.open(ModalClienteComponent, {
                  width: '70%',
                  data
                });
            
                dialogRef.afterClosed().subscribe(result => {
            
                  if (result.event == 'Agregar') {
                        this.loadClientes()
                  } else if (result.event == 'Cancel') {
                        this.loadClientes()
                  }
            
                });
            
              }

}
