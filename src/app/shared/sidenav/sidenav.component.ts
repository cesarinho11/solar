import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalReportesComponent } from 'src/app/modals/modal-reportes/modal-reportes.component';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router,  private dialog: MatDialog) { }

  ngOnInit(): void {
    this.checkScreenWidth();

    const user = this.auth.getUser();
    this.userTipo = user.tipo;

    this.filtrarMenu();


  }

  filtrarMenu() {
    // 👉 SI ES TIPO 2 → SOLO COTIZACIONES
    if (this.userTipo === 2) {
      this.menuItems = this.menuItemsAll.filter(
        item => item.label === 'Cotizaciones'
      );
    } else {
      // 👉 OTROS USUARIOS → MENÚ COMPLETO
      this.menuItems = this.menuItemsAll;
    }
  }
  @Output() sidebarToggled = new EventEmitter<boolean>();
  // isExpanded = true;
  // activeMenu: string | null = null;
  // hoverMenu: string | null = null;

  isExpanded = true; // Sidebar inicia expandido
  activeMenu: string | null = null; // Submenú abierto en modo expandido
  openFloatingMenu: string | null = null; // Submenú flotante en modo colapsado


  userTipo!: number;
  tipoReporte!: number; // 👈 ESTA LÍNEA FALTABA

  menuItemsAll = [
    { label: 'Inicio', icon: 'bi-house', route: '/dashboard' },
    { label: 'Usuarios', icon: 'bi-person', route: '/dashboard/usuarios' },
    { label: 'Clientes', icon: 'bi-person-badge', route: '/dashboard/clientes' },
    { label: 'Proveedores', icon: 'bi-people-fill', route: '/dashboard/proveedores' },
    { label: 'Contratos', icon: 'bi-file-text', route: '/dashboard/contratos' },
    { label: 'Cotizaciones', icon: 'bi-calculator', route: '/dashboard/cotizaciones' },
    { label: 'Ventas', icon: 'bi-bag', route: '/dashboard/ventas' },
    {
      label: 'Inventario', icon: 'bi-clipboard2-check-fill', subItems: [
        { label: 'Productos', route: '/dashboard/inventario/productos', icon: 'bi-card-checklist', fn: '' },
        { label: 'Herramientas', route: '/dashboard/inventario/herramientas', icon: 'bi-hammer', fn: '' },
        { label: 'Compras', route: '/dashboard/inventario/compras', icon: 'bi-bag-plus-fill' }
      ]
    },
    {
      label: 'Reportes',
      icon: 'bi-bar-chart',
      subItems: [
        { label: 'Ventas', icon: 'bi-cash-stack', tipo: 1 },
        { label: 'Productos Vendidos', icon: 'bi-box-seam', tipo: 2 },
        { label: 'Inventario', icon: 'bi-clipboard2-data', tipo: 3 }
      ]
    }
  ];
  menuItems: any[] = [];
  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenWidth();
  }

  private checkScreenWidth() {
    if (window.innerWidth <= 768) {
      this.isExpanded = false;
    } else {
      this.isExpanded = true;
    }
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    if (!this.isExpanded) {
      this.activeMenu = null; // cerrar submenú expandido
    } else {
      this.openFloatingMenu = null; // cerrar flotante
    }
  }

  toggleSubmenu(itemLabel: string) {
    if (this.isExpanded) {
      // Expandido → submenú dentro del sidebar
      this.activeMenu = this.activeMenu === itemLabel ? null : itemLabel;
    } else {
      // Colapsado → submenú flotante
      this.openFloatingMenu = this.openFloatingMenu === itemLabel ? null : itemLabel;
    }
  }

  // Cerrar submenú flotante al hacer clic fuera
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.sidebar')) {
      this.openFloatingMenu = null;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
    this.router.navigate(['/login']);
  }

  onMenuClick() {
    this.checkScreenWidth();

    // Si es pantalla pequeña, cerrar menú al navegar
    if (window.innerWidth <= 750) {
      this.isExpanded = false;
      this.activeMenu = null;
      this.openFloatingMenu = null;
    }
  }

  openSubItem(sub: any) {
    // 👉 ABRE MODAL SI ES REPORTE
    if (sub.tipo) {
      console.log('tipo', sub.tipo)
      let data = {
        title: sub.label,
        tipo:  sub.tipo
      };
        this.openReporteModal(data);
      return;
    }

    // 👉 NAVEGA SI TIENE RUTA
    if (sub.route) {
      this.router.navigate([sub.route]);
      this.onMenuClick();
    }
  }


    openReporteModal(data: any): void {
      var dialogRef = this.dialog.open(ModalReportesComponent, {
        width: '50%',
        data,
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(result => {
  
        // if (result.event == 'Agregar') {
        //    this.loadCompras();
        // } else if (result.event == 'Cancel') {
        //    this.loadCompras();
        // }
  
      });
  
    }

}
