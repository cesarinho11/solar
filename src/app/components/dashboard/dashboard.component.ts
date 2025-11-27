import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

   sidebarExpanded = true;

  onSidebarToggled(expanded: boolean) {
    this.sidebarExpanded = expanded;
  }

   logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
