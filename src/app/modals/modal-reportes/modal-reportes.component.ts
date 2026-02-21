import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PdfReportesService } from 'src/app/services/pdfReportes/pdf-reportes.service';

@Component({
  selector: 'app-modal-reportes',
  templateUrl: './modal-reportes.component.html',
  styleUrls: ['./modal-reportes.component.scss']
})
export class ModalReportesComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ModalReportesComponent>, private reportService: ReportesService, private alert: AlertService,private pdfReporte: PdfReportesService) { }

   reporteForm = new FormGroup({
        fecha_inicio: new FormControl(''),
        fecha_fin: new FormControl(''),
        formato: new FormControl('pdf') // valor por defecto
      });


  ngOnInit(): void {
  }

  generarReporte(){
    if(this.data.tipo == 1){
       // TODO: Use EventEmitter with form value
    console.log('entro', this.reporteForm.value);
    //this.pdfService.llenarContraprestacion(this.contratoForm.value)
    this.reportService.reporteVentas(this.reporteForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        // this.dialogRef.close({ event: 'Agregar' });
        console.log(this.reporteForm.value.formato)
        if(this.reporteForm.value.formato == 'pdf'){
this.pdfReporte.generatePDF(this.data.title,res.cotizaciones,this.reporteForm.value.fecha_inicio,this.reporteForm.value.fecha_fin, res.gran_total);
        }else{
 this.reportExcelVentas(this.data.title,res.cotizaciones,this.reporteForm.value.fecha_inicio,this.reporteForm.value.fecha_fin, res.gran_total)
        }
       
        this.alert.success('El reporte fue guardado correctamente');
      },
      error: (err: any) => {
        console.log('error', err);
      }
    });


    }else if(this.data.tipo == 2){
      console.log('tipoexcel')
    // TODO: Use EventEmitter with form value
    console.log('entro', this.reporteForm.value);
    //this.pdfService.llenarContraprestacion(this.contratoForm.value)
    this.reportService.reporteProductos(this.reporteForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        //this.dialogRef.close({ event: 'Agregar' });
        if(this.reporteForm.value.formato == 'pdf'){
this.pdfReporte.reportPDFProductos(this.data.title,res,this.reporteForm.value.fecha_inicio,this.reporteForm.value.fecha_fin);
        }else{
this.exportarExcel(this.data.title,res,this.reporteForm.value.fecha_inicio,this.reporteForm.value.fecha_fin)
        }
        
        this.alert.success('El reporte fue guardado correctamente');
      },
      error: (err: any) => {
        console.log('error', err);
      }
    });
    }

  }

exportarExcel(nameReport: string, data: any[], fechaInicio: string, fechaFin: string) {
console.log('entro')
  // 🔹 Filas iniciales (titulo + fechas)
  const encabezado = [
    [`${nameReport}`],
    [`Periodo: ${fechaInicio} al ${fechaFin}`],
    [''], // fila en blanco
  ];

  // 🔹 Data del reporte
  const body = data.map(item => ({
    ID: item.id_producto,
    Producto: item.producto,
    Cantidad: item.total_vendido,
    'Total Vendido': Number(item.total_venta)
  }));

  // 🔹 Crear hoja desde encabezado
  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(encabezado);

  // 🔹 Insertar data a partir de la fila 4
  XLSX.utils.sheet_add_json(worksheet, body, {
    origin: 'A4',
    skipHeader: false
  });

  // 🔹 Ancho de columnas
  worksheet['!cols'] = [
    { wch: 8 },
    { wch: 35 },
    { wch: 18 }
  ];

  // 🔹 Combinar celdas del título
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // título
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }  // fechas
  ];

  // 🔹 Crear libro
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Reporte': worksheet },
    SheetNames: ['Reporte']
  };

  // 🔹 Exportar
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  this.guardarExcel(excelBuffer, 'reporte_productos_vendidos');
}

//REPORTE DE VENTAS
reportExcelVentas(nameReport: string, data: any[], fechaInicio: string, fechaFin: string, total:any) { console.log('entro');

   const encabezado = [
    [`${nameReport}`],
    [`Periodo: ${fechaInicio} al ${fechaFin}`],
    [''],
    [''],
  ];

  const body = data.map(item => ({
    ID: item.id_cotizacion,
    Cliente: item.cliente,
    FechaVenta: item.fecha_venta,
    'Total cotizacion': Number(item.total_venta)
  }));

  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(encabezado);

  // 🔹 Insertar tabla
  XLSX.utils.sheet_add_json(worksheet, body, {
    origin: 'A4',
    skipHeader: false
  });

  // 🔹 Fila GRAN TOTAL (usa el parámetro)
  XLSX.utils.sheet_add_json(
    worksheet,
    [
      {
        ID: '',
        Producto: '',
        FechaVenta: 'TOTAL VENTAS',
        'Total Vendido': total
      }
    ],
    {
      origin: `A${body.length + 5}`,
      skipHeader: true
    }
  );

  worksheet['!cols'] = [
    { wch: 8 },
    { wch: 35 },
    { wch: 18 }
  ];

  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }
  ];

  const workbook: XLSX.WorkBook = {
    Sheets: { Reporte: worksheet },
    SheetNames: ['Reporte']
  };

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  this.guardarExcel(excelBuffer, 'reporte_productos_vendidos');
}


guardarExcel(buffer: any, fileName: string) {
  const data: Blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  saveAs(data, `${fileName}.xlsx`);
}

}
