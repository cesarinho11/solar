import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  constructor(private auth: AuthService) { }
  nombre = '';
  ngOnInit(): void {
    const user = this.auth.getUser();
    console.log(user)
    this.nombre = user.name;
    console.log(this.nombre)
  }

}
