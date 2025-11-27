import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
      this.checkScreenWidth(); 
  }

    @Output() sidebarToggled = new EventEmitter<boolean>();
  // isExpanded = true;
  // activeMenu: string | null = null;
  // hoverMenu: string | null = null;

   isExpanded = true; // Sidebar inicia expandido
  activeMenu: string | null = null; // Submenú abierto en modo expandido
  openFloatingMenu: string | null = null; // Submenú flotante en modo colapsado

  menuItems = [
    { label: 'Inicio', icon: 'bi-house', route: '/dashboard' },
    { label: 'Usuarios', icon: 'bi-person',  route: '/dashboard/usuarios' },
    { label: 'Clientes', icon: 'bi-person-badge',  route: '/dashboard/clientes' },
    { label: 'Proveedores', icon: 'bi-people-fill',  route: '/dashboard/proveedores' },
    { label: 'Contratos', icon: 'bi-file-text', route: '/dashboard/contratos'},
    { label: 'Cotizaciones', icon: 'bi-calculator', route: '/dashboard/cotizaciones'},
    { label: 'Ventas', icon: 'bi-bag', route: '/dashboard/ventas'},
    { label: 'Inventario', icon: 'bi-clipboard2-check-fill', subItems: [
      { label: 'Productos', route: '/dashboard/inventario/productos', icon: 'bi-card-checklist', fn: '' },
      { label: 'Compras', route: '/dashboard/inventario/compras', icon: 'bi-bag-plus-fill' }
    ]}
  ];

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

}
