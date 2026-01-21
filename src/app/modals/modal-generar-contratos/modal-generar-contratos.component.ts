import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ClientesServiceService } from 'src/app/services/clientes/clientes-service.service';
import { ContratosService } from 'src/app/services/contratos/contratos.service';
import { PdfService } from 'src/app/services/pdf/pdf.service';

@Component({
  selector: 'app-modal-generar-contratos',
  templateUrl: './modal-generar-contratos.component.html',
  styleUrls: ['./modal-generar-contratos.component.scss']
})
export class ModalGenerarContratosComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private contratosService: ContratosService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalGenerarContratosComponent>, private alert: AlertService, private pdfService: PdfService, private clientesService: ClientesServiceService) { }

  opcion = new FormControl('');
  contratoForm = new FormGroup({
    id_contrato: new FormControl(''),
    n_solicitud: new FormControl(''),
    fecha: new FormControl('', Validators.required),
    fecha_operacion: new FormControl('', Validators.required),

    dias: new FormControl(''), //obtener de fecha
    mes: new FormControl(''),
    year: new FormControl(''),

    fecha_inter: new FormControl('', Validators.required),
    dias_inter: new FormControl(''), //obtener de fecha
    mes_inter: new FormControl(''),
    year_inter: new FormControl(''),

    fecha_contra: new FormControl('', Validators.required),
    dias_contra: new FormControl(''), //obtener de fecha
    mes_contra: new FormControl(''),
    year_contra: new FormControl(''),

    cliente_id: new FormControl(''),
    nombre: new FormControl(''),
    cargo: new FormControl('', Validators.required),
    ine: new FormControl(''),
    tipo_doc: new FormControl('', Validators.required),

    telefono: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+?[0-9]+$/)
    ]),
    correo: new FormControl('', Validators.required),
    ciudad: new FormControl('', Validators.required),
    calle: new FormControl('', Validators.required),
    n_exterior: new FormControl('', Validators.required),
    n_interior: new FormControl(''),
    estado: new FormControl('', Validators.required),
    municipio: new FormControl('', Validators.required),
    cp: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]+$/)
    ]),
    colonia: new FormControl('', Validators.required),
    domicilio: new FormControl(this), // compuesto de calle municipio estado numero 

    x: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[+-]?\d+(\.\d+)?$/)
    ]),
    y: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[+-]?\d+(\.\d+)?$/)
    ]),

    rpu: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9 ]+$/)
    ]),
    rmu: new FormControl(''),
    n_cuenta: new FormControl(''),

    tension: new FormControl('BAJA'), //baja
    capacidad: new FormControl('', Validators.required),
    capacidad_incrementar_opcional: new FormControl(''),
    capacidad_incrementar: new FormControl(''),
    tension_interconexion: new FormControl('220'),
    tecnologia: new FormControl('SOLAR'),
    tecnologia_secundaria: new FormControl(''),
    regimen_contraprestacion: new FormControl('Net Metering'),
    tarifa: new FormControl('1B'),
    voltaje: new FormControl(''),
    n_fases: new FormControl(''),
    n_hilos: new FormControl(''),
    n_medidor: new FormControl(''),
    tipo_medidor: new FormControl('Digital'),
    carga: new FormControl(''),
    potencia: new FormControl('', Validators.required),
    carga_total: new FormControl(''),
    central_electrica: new FormControl('BT'), // MT
    n_unidades: new FormControl(''),


    baja_tencion: new FormControl(false),
    media_tension: new FormControl(false),
    consumo_centros: new FormControl(false),
    consumo_centros_ventas: new FormControl(false),
    venta_total: new FormControl(false),

    especificar: new FormControl(''),

    solar: new FormControl(false),
    biomasa: new FormControl(false),
    otro: new FormControl(false),
    eolico: new FormControl(false),
    cogeneracion: new FormControl(false),


    clienteNuevo: new FormControl(false),
  });

  datosContacto = {
    nombre: 'Saul Orozco Maldonado',
    puesto: 'Gerente',
    domicilio: 'Gregorio Tores Quintero',
    n_exterior: '254',
    n_interior: '',
    cp: '28974',
    colonia: 'san isidro',
    municipio: 'Villa de Alvarez',
    correo: 'vazcosolar@gmail.com',
    estado: 'colima',
    telefono: '3121144563',
  }

  user = {
    nombre: 'Cesar Guzman',
    ine: 'INE 20302323',
    tension: 'baja',
    rpu: 'RPU 2012154514',
    rmu: '2012 154514 XXXA A A A',
    n_cuenta: '25555555',
    domicilio: 'Narciso mendoza #82',
    capacidad: '2.5',
    tension_interconexion: '220',
    tecnologia: 'solar',
    telefono: '3121445663',
    correo: 'cesar@gmail.com',
    regimen_contraprestacion: 'Net Metering',
    ciudad: 'Colima, col',
    dias: '24',
    mes: 'Octubre',
    year: '2025',
    name1: 'name1',
    name2: 'name2',
    name3: 'name3',
    namee: 'namee',
    namee2: 'namee2',
    namee3: 'namee3',
    undefined_21: 'undefined_21',
    telelel: 'telelel',
    opcionsino: 'si',
    tarifa: '1B',
    voltaje: '220V',
    n_fases: '2',
    n_hilos: '3',
    n_medidor: '3111WYX',
    tipo_medidor: 'Digital', //o mecanico
    carga: '2.22',
    potencia: '2',
    demanda_contratada: '2',
    central_electrica: 'BT', // O MT
    aceptaTerminos: true,
    calle: 'Narciso mendoza',
    n_exterior: '13',
    n_interior: '',
    estado: 'Colima',
    municipio: 'Villa de Alvarez',
    cp: '28970',
    colonia: 'centro',
    fecha_operacion: '14/10/2025',
    capacidad_incrementar: '',
    especificar: '',
    n_unidades: '6',
    tecnologia_secundaria: '45',
    x: '19.21454',
    y: '-103.21454',
    cargo: 'Propietario',
    fecha: '14/10/2025',
    n_solicitud: '1254',

  };


  mostrarFormulario: boolean = false;
  clienesItems: any;
  usuariosItems: any;
  title = 'NUEVO';

  ngOnInit(): void {

    this.contratoForm.get('capacidad')?.valueChanges.subscribe(cap => {
      if (cap) {
        const resultado = Number(cap) * 5 * 30.4;
        this.contratoForm.get('capacidad_incrementar')?.setValue(resultado, { emitEvent: false });
      } else {
        this.contratoForm.get('capacidad_incrementar')?.setValue('', { emitEvent: false });
      }
    });

    this.contratoForm.get('potencia')?.valueChanges.subscribe(cap => {
      if (cap) {
        const resultado = Number(cap) / 0.9;
        this.contratoForm.get('carga_total')?.setValue(resultado.toFixed(2), { emitEvent: false });
      } else {
        this.contratoForm.get('carga_total')?.setValue('', { emitEvent: false });
      }
    });


    this.clientes();

    if (this.data.accion == 'editar') {
      this.title = 'EDITAR';
      console.log('editar contrato tiene id')
      const { ...rest } = this.data;
      this.contratoForm.patchValue(rest);
      console.log('iddddddddddd c', rest.cliente_id)
      // this.contratoForm.get('cliente_id')?.setValue(rest.id_cliente);
    }

    this.contratoForm.valueChanges.subscribe(values => {
      const { calle, n_exterior, n_interior, colonia, municipio, estado, cp } = values;
      const domicilioCompleto = [
        calle,
        n_exterior ? `${n_exterior},` : '',
        n_interior ? ` ${n_interior},` : '',
        colonia + ',',
        municipio + ',',
        estado + ',',
        cp ? `C.P. ${cp}` : ''
      ]
        .filter(Boolean)
        .join(' ');

      this.contratoForm.get('domicilio')?.setValue(domicilioCompleto, { emitEvent: false });
    });

    // this.contratoForm.get('fecha')?.valueChanges.subscribe(valor => {
    //   if (valor) {
    //     const fecha = new Date(valor);
    //     if (!isNaN(fecha.getTime())) {
    //       const dia = fecha.getDate();
    //       const mes = fecha.getMonth(); // 0 = enero, 1 = febrero...
    //       const year = fecha.getFullYear();

    //       const nombresMeses = [
    //         'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    //         'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    //       ];

    //       this.contratoForm.patchValue(
    //         {
    //           dias: dia.toString(),
    //           mes: nombresMeses[mes],
    //           year: year.toString()
    //         },
    //         { emitEvent: false }
    //       );
    //     }
    //   } else {
    //     // Si se borra la fecha, limpia los campos relacionados
    //     this.contratoForm.patchValue(
    //       { dias: '', mes: '', year: '' },
    //       { emitEvent: false }
    //     );
    //   }
    // });

    this.contratoForm.get('fecha')?.valueChanges.subscribe(valor => {
      if (valor) {

        // Evitar desfase por zona horaria
        const [anio, mesStr, diaStr] = valor.split('-');
        const fecha = new Date(Number(anio), Number(mesStr) - 1, Number(diaStr));

        if (!isNaN(fecha.getTime())) {
          const dia = fecha.getDate();
          const mes = fecha.getMonth();
          const year = fecha.getFullYear();

          const nombresMeses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
          ];

          this.contratoForm.patchValue(
            {
              dias: dia.toString(),
              mes: nombresMeses[mes],
              year: year.toString()
            },
            { emitEvent: false }
          );
        }

      } else {
        this.contratoForm.patchValue(
          { dias: '', mes: '', year: '' },
          { emitEvent: false }
        );
      }
    });

       this.contratoForm.get('fecha_inter')?.valueChanges.subscribe(valor => {
      if (valor) {

        // Evitar desfase por zona horaria
        const [anio, mesStr, diaStr] = valor.split('-');
        const fecha = new Date(Number(anio), Number(mesStr) - 1, Number(diaStr));

        if (!isNaN(fecha.getTime())) {
          const dia = fecha.getDate();
          const mes = fecha.getMonth();
          const year = fecha.getFullYear();

          const nombresMeses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
          ];

          this.contratoForm.patchValue(
            {
              dias_inter: dia.toString(),
              mes_inter: nombresMeses[mes],
              year_inter: year.toString()
            },
            { emitEvent: false }
          );
        }

      } else {
        this.contratoForm.patchValue(
          { dias_inter: '', mes_inter: '', year_inter: '' },
          { emitEvent: false }
        );
      }
    });

     this.contratoForm.get('fecha_contra')?.valueChanges.subscribe(valor => {
      if (valor) {

        // Evitar desfase por zona horaria
        const [anio, mesStr, diaStr] = valor.split('-');
        const fecha = new Date(Number(anio), Number(mesStr) - 1, Number(diaStr));

        if (!isNaN(fecha.getTime())) {
          const dia = fecha.getDate();
          const mes = fecha.getMonth();
          const year = fecha.getFullYear();

          const nombresMeses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
          ];

          this.contratoForm.patchValue(
            {
              dias_contra: dia.toString(),
              mes_contra: nombresMeses[mes],
              year_contra: year.toString()
            },
            { emitEvent: false }
          );
        }

      } else {
        this.contratoForm.patchValue(
          { dias_contra: '', mes_contra: '', year_contra: '' },
          { emitEvent: false }
        );
      }
    });


  }

  getInvalidControls() {
    const invalid = [];
    const controls = this.contratoForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }

  onSubmit() {

    const form: any = document.querySelector('form');

    if (this.contratoForm.invalid) {
      console.log('entro')
      console.log('Campos inválidos:', this.getInvalidControls());
      this.contratoForm.markAllAsTouched();
      this.alert.error('Revise los datos del formulario');
      return;
    }


    if (!form.checkValidity()) {
      form.reportValidity(); // Muestra la alerta del navegador
      return; // No avanza
    }



    // TODO: Use EventEmitter with form value
    console.log('entro', this.contratoForm.value);
    //this.pdfService.llenarContraprestacion(this.contratoForm.value)
    this.contratosService.addContrato(this.contratoForm.value).subscribe({
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

    if (this.contratoForm.invalid) {
      console.log('entro')
      console.log('Campos inválidos:', this.getInvalidControls());
      this.contratoForm.markAllAsTouched();
      this.alert.error('Revise los datos del formulario');
      return;
    }

    // TODO: Use EventEmitter with form value
    console.log('entro', this.contratoForm.value);
    //this.pdfService.llenarContraprestacion(this.contratoForm.value)
    this.contratosService.editContrato(this.contratoForm.value).subscribe({
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

  clientes() {
    this.clientesService.obtenerClientes().subscribe({
      next: (res: any) => {
        console.log(res);
        this.clienesItems = res;
      },
      error: (err: any) => {
        console.log('error', err);
      }
    });
  }

  onClienteSeleccionado() {
    const id = this.contratoForm.get('cliente_id')?.value;

    if (!id) return;

    const cliente = this.clienesItems.find((c: { id_cliente: any; }) => c.id_cliente == id);

    if (cliente) {
      this.contratoForm.patchValue({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        correo: cliente.correo
      });
    }
  }


}
