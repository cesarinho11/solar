import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ProveedorService } from 'src/app/services/proveedor/proveedor.service';

@Component({
  selector: 'app-modal-proveedor',
  templateUrl: './modal-proveedor.component.html',
  styleUrls: ['./modal-proveedor.component.scss']
})
export class ModalProveedorComponent implements OnInit {

 constructor(@Inject(MAT_DIALOG_DATA) public data: any,
       private fb: FormBuilder,
       public dialogRef: MatDialogRef<ModalProveedorComponent>, private alert: AlertService, private proveedorService: ProveedorService) { }
 
       title = 'producto';
 
     proveedorForm = new FormGroup({
       id_proveedor: new FormControl(''),
       nombre: new FormControl(''),
       domicilio: new FormControl(''),
       telefono: new FormControl(''),
       correo: new FormControl('')
     });
 
   ngOnInit(): void {
      if(this.data.accion == 'editar'){
       console.log('editar contrato tiene id')
       const { ...rest } = this.data;
       this.proveedorForm.patchValue(rest);
     }
   }
 
 
    onSubmit() {
     // TODO: Use EventEmitter with form value
     console.log('entro', this.proveedorForm.value);
     //this.pdfService.llenarContraprestacion(this.contratoForm.value)
     this.proveedorService.addProveedor(this.proveedorForm.value).subscribe({
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
 
   actualizarContrato(){
     
     // TODO: Use EventEmitter with form value
     console.log('entro', this.proveedorForm.value);
     //this.pdfService.llenarContraprestacion(this.contratoForm.value)
     this.proveedorService.editProveedor(this.proveedorForm.value).subscribe({
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
