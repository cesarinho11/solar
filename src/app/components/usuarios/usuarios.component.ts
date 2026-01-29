import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuarioComponent } from 'src/app/modals/modal-usuario/modal-usuario.component';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  constructor(private usuariosService: UsuariosService, private dialog: MatDialog) { }

  tableColumns = [
    { key: 'id', label: 'iD Usuario ' },
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Correo' }
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
    this.loadProductos()
  }

  loadProductos(page: number = 1) {

    this.usuariosService.getUsuarios(page, this.search).subscribe({
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
    let data = { accion: 'nuevo' }
    this.openDialog(data)
  }

  onTableAction(event: { action: string; row: any }) {
    if (event.action === 'edit') {
      event.row.accion = event.action;
      console.log('Editar →', event.row);
      this.openDialog(event.row)

    } else if (event.action === 'contrato') {
      event.row.accion = event.action;
      console.log('Contratos →', event.row);

    }
    else if (event.action === 'delete') {
      event.row.accion = event.action;
      console.log('Eliminar →', event.row);
      this.eliminar(event.row.id)
    }
  }


  openDialog(data: any): void {
    var dialogRef = this.dialog.open(ModalUsuarioComponent, {
      width: '70%',
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


  eliminar(id_cotizacion: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar el usuario?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {

        // 👉 AQUÍ LLAMAS TU SERVICIO SI CONFIRMA
        let data = { id: id_cotizacion }
        this.usuariosService.deleteUsuario(data).subscribe({
          next: (res: any) => {
            Swal.fire('Confirmado', 'El usuario fue eliminado correctamente', 'success');
            console.log(res);
            this.loadProductos();
          },
          error: (err: any) => {
            Swal.fire('Error', err.error.error, 'error');
            console.log(err);
          }
        });

      }
    });
  }

}
