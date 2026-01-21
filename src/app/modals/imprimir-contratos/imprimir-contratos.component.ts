import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PdfService } from 'src/app/services/pdf/pdf.service';

@Component({
  selector: 'app-imprimir-contratos',
  templateUrl: './imprimir-contratos.component.html',
  styleUrls: ['./imprimir-contratos.component.scss']
})
export class ImprimirContratosComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private pdfservice:PdfService) { }

  ngOnInit(): void {
    this.pdfservice.listFields()
    this.replaceNullsWithEmpty();
    console.log('datos',this.data)
  }

  contratoInterconexion(){
    this.pdfservice.llenarInterconexion(this.data);

  }

  contratoContraprestacion(){
    this.pdfservice.llenarContraprestacion(this.data);
  }

  anexo(){
     const datosContacto ={
      nombre: 'Saul Orozco Maldonado',
      puesto: 'Gerente',
      domicilio: 'Gregorio Torres Quintero',
      n_exterior: '254',
      n_interior: '',
      cp: '28974',
      colonia: 'San Isidro',
      municipio: 'Villa de Alvarez',
      correo: 'vazcosolar@gmail.com',
      estado: 'Colima',
      telefono: '3123032690',
    }

    this.pdfservice.llenarAnexo(this.data, datosContacto);
  }

  replaceNullsWithEmpty(){
      Object.keys(this.data).forEach(key => {
      if (this.data[key] === null) {
        this.data[key] = '';
      }
    });
  }


}
