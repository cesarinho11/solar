import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule , ReactiveFormsModule } from '@angular/forms'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { TablaComponent } from './shared/tabla/tabla.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ModalGenerarContratosComponent } from './modals/modal-generar-contratos/modal-generar-contratos.component';
import { ContratosComponent } from './components/contratos/contratos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatDialogModule} from '@angular/material/dialog';
import { ImprimirContratosComponent } from './modals/imprimir-contratos/imprimir-contratos.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ComprasComponent } from './components/compras/compras.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ModalProductoComponent } from './modals/modal-producto/modal-producto.component';
import { ModalProveedorComponent } from './modals/modal-proveedor/modal-proveedor.component';
import { CotizacionesComponent } from './components/cotizaciones/cotizaciones.component';
import { ModalCotizacionComponent } from './modals/modal-cotizacion/modal-cotizacion.component';
import { SpinnerInterceptor } from './interceptor/spinner.interceptor';
import { SpinnerComponent } from './shared/spinner/spinner/spinner.component';
import { ModalClienteComponent } from './modals/modal-cliente/modal-cliente.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ModalComprasComponent } from './modals/modal-compras/modal-compras.component';
import { ModalCuentaComponent } from './modals/modal-cuenta/modal-cuenta.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SidenavComponent,
    TablaComponent,
    ClientesComponent,
    UsuariosComponent,
    ModalGenerarContratosComponent,
    ContratosComponent,
    ImprimirContratosComponent,
    ProductosComponent,
    ComprasComponent,
    ProveedoresComponent,
    InicioComponent,
    ModalProductoComponent,
    ModalProveedorComponent,
    CotizacionesComponent,
    ModalCotizacionComponent,
    SpinnerComponent,
    ModalClienteComponent,
    VentasComponent,
    ModalComprasComponent,
    ModalCuentaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule, BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
