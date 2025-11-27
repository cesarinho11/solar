import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, private alert: AlertService) {}

  email = '';
  password = '';
  
  ngOnInit(): void {
    if (this.auth.getToken()) {
      // Si ya existe sesión, redirige al dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.alert.success('Inicio de sesion correcto');
        this.router.navigate(['/dashboard']);
      },
      error: () =>
      this.alert.error('Credenciales inválidas')
    });
  }

}
