import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ContratosComponent } from './components/contratos/contratos.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductosComponent } from './components/productos/productos.component';
import { ComprasComponent } from './components/compras/compras.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { CotizacionesComponent } from './components/cotizaciones/cotizaciones.component';
import { VentasComponent } from './components/ventas/ventas.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'dashboard', component: DashboardComponent },
  {path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'clientes', component: ClientesComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'contratos', component: ContratosComponent},
      { path: 'cotizaciones', component: CotizacionesComponent},
      { path: 'ventas', component: VentasComponent},
      { path: '', component: InicioComponent},
      { path: 'proveedores', component: ProveedoresComponent},
      { path: 'inventario/productos', component: ProductosComponent},
      { path: 'inventario/compras', component: ComprasComponent},
      { path: 'contratos', component: ContratosComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Redirección por defecto
    ],  canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
