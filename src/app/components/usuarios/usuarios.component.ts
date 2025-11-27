import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  constructor(private usuariosService: UsuariosService) { }
      
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
