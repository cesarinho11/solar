import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert/alert.service';
import { PagosServiceService } from 'src/app/services/pagos/pagos-service.service';

@Component({
  selector: 'app-modal-add-pago',
  templateUrl: './modal-add-pago.component.html',
  styleUrls: ['./modal-add-pago.component.scss']
})
export class ModalAddPagoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
public dialogRef: MatDialogRef<ModalAddPagoComponent>, private pagosService: PagosServiceService, private alert: AlertService) { }

title='Agregar pago';

pagoForm = new FormGroup({
       id_cotizacion: new FormControl(this.data.id_cotizacion),
       nombre: new FormControl(''),
       domicilio: new FormControl(''),
       id_pago: new FormControl(''),
       fecha_pago:  new FormControl('', Validators.required),
       fecha_proximo_pago:  new FormControl('', Validators.required),
       forma_pago: new FormControl('', Validators.required),
       monto: new FormControl('', Validators.required),
       saldo_anterior: new FormControl(''),
       saldo_actual: new FormControl(''),
       total_venta: new FormControl(this.data.total_venta),
       saldo: new FormControl(this.data.saldo),
     });


  ngOnInit(): void {
    console.log('data en pagos', this.data)
    console.log('entro modal')

    const { ...rest } = this.data;
      this.pagoForm.patchValue(rest);
  }

    getInvalidControls() {
    const invalid = [];
    const controls = this.pagoForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }

  onSubmit(){
    console.log('entro', this.pagoForm.value);

    if(this.pagoForm.value.monto > this.data.saldo){
      this.alert.error('El monto no puede ser mayor al saldo actual');
    }else{


        const form: any = document.querySelector('form');

    if (this.pagoForm.invalid) {
      console.log('entro')
      console.log('Campos inválidos:', this.getInvalidControls());
      this.pagoForm.markAllAsTouched();
      this.alert.error('Revise los datos del formulario');
      return;
    }


    if (!form.checkValidity()) {
      form.reportValidity(); // Muestra la alerta del navegador
      return; // No avanza
    }



  this.pagosService.addPago(this.pagoForm.value).subscribe({
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
}
