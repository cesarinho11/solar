import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProductosService } from 'src/app/services/productos/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, private productosService: ProductosService, private alert: AlertService,) { }

  ngOnInit(): void {
    this.alertStock()
  }

  sidebarExpanded = true;

  productos_faltantes = 0;

  onSidebarToggled(expanded: boolean) {
    this.sidebarExpanded = expanded;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  alertStock() {
    this.productosService.alertaStock().subscribe({
      next: (res: any) => {
        console.log(res);
        var text = '';
        if (res.length > 0) {
          this.productos_faltantes = res.length;
          for (let index = 0; index < res.length; index++) {
            text += `${res[index].nombre}: ${res[index].stock}<br>`

          }

          // this.alert.success(text,'Productos con stock bajo');

          Swal.fire({
            title: 'Productos con stock bajo',
            html: text, // 👈 IMPORTANTE
            icon: 'warning'
          });

        }


      },
      error: (err: any) => {
        console.log('error', err);
      }
    });
  }

  verProductosFaltantes(){
    this.alertStock()
  }
}
