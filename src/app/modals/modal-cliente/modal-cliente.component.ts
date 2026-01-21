import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ClientesServiceService } from 'src/app/services/clientes/clientes-service.service';

@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.scss']
})
export class ModalClienteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
         private fb: FormBuilder,
         public dialogRef: MatDialogRef<ModalClienteComponent>, private alert: AlertService, private clientesService: ClientesServiceService) { }
   
         title = 'Cliente';
   
       clienteForm = new FormGroup({
         id_cliente: new FormControl(''),
         nombre: new FormControl(''),
         domicilio: new FormControl(''),
         telefono: new FormControl(''),
         correo: new FormControl('')
       });
   
     ngOnInit(): void {
        if(this.data.accion == 'editar'){
         console.log('editar contrato tiene id')
         const { ...rest } = this.data;
         this.clienteForm.patchValue(rest);
       }
     }
   
   
      onSubmit() {
       // TODO: Use EventEmitter with form value
       console.log('entro', this.clienteForm.value);
       //this.pdfService.llenarContraprestacion(this.contratoForm.value)
       this.clientesService.addCliente(this.clienteForm.value).subscribe({
         next: (res: any) => {
           console.log(res);
           this.dialogRef.close({ event: 'Agregar' });
           this.alert.success('El registro fue guardado correctamente');
         },
         error: (err: any) => {
           console.log('error', err);
         }
       });
     }
   
     actualizarCliente(){
       
       // TODO: Use EventEmitter with form value
       console.log('entro', this.clienteForm.value);
       //this.pdfService.llenarContraprestacion(this.contratoForm.value)
       this.clientesService.editCliente(this.clienteForm.value).subscribe({
         next: (res: any) => {
           console.log(res);
           this.dialogRef.close({ event: 'Agregar' });
           this.alert.success('El registro fue actualizado correctamente');
         },
         error: (err: any) => {
           console.log('error', err);
         }
       });
     }
}
