import { Component, OnInit } from '@angular/core';
import { ModalGenerarContratosComponent } from 'src/app/modals/modal-generar-contratos/modal-generar-contratos.component';
import { MatDialog } from '@angular/material/dialog';
import { ContratosService } from 'src/app/services/contratos/contratos.service';
import { PdfService } from 'src/app/services/pdf/pdf.service';
import { ImprimirContratosComponent } from 'src/app/modals/imprimir-contratos/imprimir-contratos.component';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements OnInit {

  constructor(private dialog: MatDialog, private contratos: ContratosService, private pdfService: PdfService) { }

  ngOnInit(): void {
    this.loadServicios();
  }

  tableColumns = [
    { key: 'id_contrato', label: 'iD Contrato ' },
    { key: 'rpu', label: 'RPU' },
    { key: 'nombre', label: 'Cliente' },
    { key: 'domicilio', label: 'Domicilio' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'telefono', label: 'Teléfono' },
  ];

  tableActions = [
    { label: 'Editar', icon: 'bi-pencil-square', type: 'edit', class: 'btn btn-success' },
    { label: 'Contratos', icon: 'bi-file-pdf', type: 'contrato', class: 'btn btn-primary' },
    { label: 'Eliminar', icon: 'bi-trash', type: 'delete', class: 'btn btn-danger' }
  ];
  tableData: any
  currentPage = 1;
  lastPage = 1;
  search = '';

  onTableAction(event: { action: string; row: any }) {
    if (event.action === 'edit') {
      event.row.accion = event.action;
      console.log('Editar →', event.row);
      let data = event.row;
      data.accion = 'editar'
    this.openDialog(data)

    } else if (event.action === 'contrato') {
      event.row.accion = event.action;
      console.log('Contratos →', event.row);
      this.modalImprimirContratos(event.row);

    }
    else if (event.action === 'delete') {
      event.row.accion = event.action;
      console.log('Eliminar →', event.row);
    }
  }

  addServicio() {
    let data = { accion: 'nuevo' }
    this.openDialog(data)
  }


  openDialog(data: any): void {
    var dialogRef = this.dialog.open(ModalGenerarContratosComponent, {
      width: '70%',
      data
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event == 'Agregar') {
        this.loadServicios();
      } else if (result.event == 'Cancel') {
        this.loadServicios();
      }

    });

  }


  modalImprimirContratos(data: any): void {
    var dialogRef = this.dialog.open(ImprimirContratosComponent, {
      width: '70%',
      data
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event == 'Agregar') {
        this.loadServicios();
      } else if (result.event == 'Cancel') {
        this.loadServicios();
      }

    });

  }


  loadServicios(page: number = 1) {

    this.contratos.getContratos(page, this.search).subscribe({
      next: (data) => {
        console.log(data)
        this.tableData = data.data;
        this.currentPage = data.current_page;
        this.lastPage = data.last_page;
      },
      error: (err) => {
        console.log('error al obtener usuarios')
      }
    })
  }

  cambiarPagina(page: number) {
    if (page >= 1 && page <= this.lastPage) {
      this.loadServicios(page);
    }
  }

  buscar() {
    this.loadServicios();
  }

  verCampospdf() {
    this.pdfService.listFields();
  }

  generarContrato() {
    const datosContacto = {
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

    const user = {
      'AGUA DE': 'HOLA',
      'PRUEBAAA 1': 'PRUEBA',
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

    //this.pdfService.llenarContraprestacion(user);
    this.pdfService.llenarInterconexion(user);
    //this.pdfService.llenarAnexo(user, datosContacto);
  }


}
