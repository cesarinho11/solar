import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  usuarioForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    domicilio: new FormControl(''),
    tipo: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    if (this.data.accion == 'edit') {
      console.log('editar contrato tiene id')
      const { ...rest } = this.data;
      rest.password = '';
      this.usuarioForm.patchValue(rest);
    }
  }

  getInvalidControls() {
    const invalid = [];
    const controls = this.usuarioForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }


  onSubmit() {
    // TODO: Use EventEmitter with f
    // orm value


    const form: any = document.querySelector('form');

    if (this.usuarioForm.invalid) {
      console.log('entro')
      console.log('Campos inválidos:', this.getInvalidControls());
      this.usuarioForm.markAllAsTouched();
      this.alert.error('Revise los datos del formulario');
      return;
    }


    if (!form.checkValidity()) {
      form.reportValidity(); // Muestra la alerta del navegador
      return; // No avanza
    }


    console.log('entro', this.usuarioForm.value);
    //this.pdfService.llenarContraprestacion(this.contratoForm.value)
    this.usuariosService.addUsuario(this.usuarioForm.value).subscribe({
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
    console.log('entro', this.usuarioForm.value);
    //this.pdfService.llenarContraprestacion(this.contratoForm.value)
    this.usuariosService.editUsuario(this.usuarioForm.value).subscribe({
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
