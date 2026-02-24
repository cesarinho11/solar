import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PagosServiceService } from 'src/app/services/pagos/pagos-service.service';
import { ProductosService } from 'src/app/services/productos/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, private productosService: ProductosService, private alert: AlertService,private pagosService:PagosServiceService) { }

  async ngOnInit(): Promise<void> {
    await  this.alertStock()
  await   this.alertPagosProximos();

  this.productosService.productosFaltantes$
    .subscribe(cantidad => {
      this.productos_faltantes = cantidad;
    });

  // Primera verificación
  this.productosService.verificarStock();
  
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


alertStock(): Promise<void> {
  return new Promise((resolve) => {
    this.productosService.alertaStock().subscribe({
      next: (res: any) => {
        if (res.length === 0) {
          resolve();
          return;
        }

        let text = `
          <table class="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Stock actual</th>
              </tr>
            </thead>
            <tbody>
        `;

        res.forEach((p: any) => {
          text += `<tr><td>${p.nombre}</td><td>${p.stock}</td></tr>`;
        });

        text += `</tbody></table>`;

        Swal.fire({
          title: 'Productos con stock bajo',
          html: text,
          icon: 'warning'
        }).then(() => resolve()); // 👈 cuando se cierra
      },
      error: () => resolve()
    });
  });
}
  verProductosFaltantes(){
    this.alertStock()
  }

alertPagosProximos(): Promise<void> {
  return new Promise((resolve) => {
    this.pagosService.alertaPagos().subscribe({
      next: (res: any) => {
        if (res.length === 0) {
          resolve();
          return;
        }

        let text = `
          <table class="table">
            <thead>
              <tr>
                <th>N° cotización</th>
                <th>Cliente</th>
                <th>Próximo pago</th>
              </tr>
            </thead>
            <tbody>
        `;

        res.forEach((p: any) => {
          text += `
            <tr>
              <td>${p.id_cotizacion}</td>
              <td>${p.nombre}</td>
              <td>${p.fecha_proximo_pago}</td>
            </tr>`;
        });

        text += `</tbody></table>`;

        Swal.fire({
          title: 'Clientes con próximo pago',
          html: text,
          icon: 'warning'
        }).then(() => resolve());
      },
      error: () => resolve()
    });
  });
}


}
