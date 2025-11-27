import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalProveedorComponent } from 'src/app/modals/modal-proveedor/modal-proveedor.component';
import { ProveedorService } from 'src/app/services/proveedor/proveedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {

   constructor(private proveedorService: ProveedorService, private dialog: MatDialog) { }
      
        tableColumns = [
          { key: 'id_proveedor', label: 'ID Proveedor' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'domicilio', label: 'Domicilio' },
          { key: 'correo', label: 'Correo' },
          { key: 'telefono', label: 'Telefono' },
          { key: 'precio', label: 'Precio' },
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
      
          this.proveedorService.getProveedores(page, this.search).subscribe({
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
            this.eliminar(event.row.id_proveedor)
          }
        }
        
         addProducto() {
      let data = { accion: 'nuevo' }
      this.openDialog(data)
    }
  
  
          openDialog(data: any): void {
            var dialogRef = this.dialog.open(ModalProveedorComponent, {
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
                          title: '¿Estás seguro de eliminar el producto?',
                          text: "",
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonText: 'Sí, confirmar',
                          cancelButtonText: 'Cancelar'
                        }).then((result) => {
                      
                          if (result.isConfirmed) {
                      
                            // 👉 AQUÍ LLAMAS TU SERVICIO SI CONFIRMA
                            let data = {id: id_cotizacion}
                            this.proveedorService.deleteProveedor(data).subscribe({
                              next: (res: any) => {
                                Swal.fire('Confirmado', 'El producto fue eliminado correctamente', 'success');
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
