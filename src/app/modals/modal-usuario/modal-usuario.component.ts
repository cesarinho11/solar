import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.scss']
})
export class ModalUsuarioComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalUsuarioComponent>, private alert: AlertService, private usuariosService: UsuariosService) { }

  title = 'usuario';

  proveedorForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    domicilio: new FormControl(''),
    tipo: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit(): void {
    if (this.data.accion == 'edit') {
      console.log('editar contrato tiene id')
      const { ...rest } = this.data;
      rest.password = '';
      this.proveedorForm.patchValue(rest);
    }
  }


  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log('entro', this.proveedorForm.value);
    //this.pdfService.llenarContraprestacion(this.contratoForm.value)
    this.usuariosService.addUsuario(this.proveedorForm.value).subscribe({
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

  actualizarContrato() {

    // TODO: Use EventEmitter with form value
    console.log('entro', this.proveedorForm.value);
    //this.pdfService.llenarContraprestacion(this.contratoForm.value)
    this.usuariosService.editUsuario(this.proveedorForm.value).subscribe({
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
