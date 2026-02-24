import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { window } from 'rxjs/operators';
import { logo, img_encabezado, img_footer } from 'src/app/variables/imagenSolar';
import { marcas } from '../../variables/imagenSolar';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfReportesService {

  constructor() { }

  
  formatCurrency(value: number | string) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(Number(value || 0));
}


    async generatePDF(nameReport: string, data: any[], fechaInicio: string, fechaFin: string, total:any) {
  
        const headerImage = img_encabezado.img;
  const footerImage = img_footer.img;

  /* 🔹 Convertir data a filas pdfMake */
  const bodyData = data.map((item, index) => ([
    {
      text: item.id_cotizacion ?? '',
      alignment: 'center',
      fontSize: 8
    },
    {
      text: item.cliente ?? '',
      alignment: 'center',
      fontSize: 8
    },
    {
      text: item.domicilio_instalacion ?? '',
      alignment: 'center',
      fontSize: 8
    },
    {
      text:  item.fecha_venta ? item.fecha_venta.split(' ')[0] : '',
      alignment: 'center',
      fontSize: 8
    },
    {
      text:  item.vendedor ??  '',
      alignment: 'center',
      fontSize: 8
    },
    {
      text: `$${Number(item.total_venta ?? 0).toLocaleString('es-MX', {
        minimumFractionDigits: 2
      })}`,
      alignment: 'right',
      fontSize: 8
    }
  ]));

  const documentDefinition: any = {
    pageMargins: [40, 120, 40, 120],

    header: {
      image: headerImage,
      width: 570,
      margin: [0, 5]
    },

    footer: {
      image: footerImage,
      width: 550,
      margin: [25, 0]
    },

    content: [

      /* 🔹 Título */
      {
        text: [
          { text: `REPORTE DE ${nameReport.toUpperCase()}\n`, bold: true },
          { text: `Periodo del ${fechaInicio} al ${fechaFin}` }
        ],
        margin: [0, 20],
        fontSize: 12
      },

      /* 🔹 Tabla */
      {
        table: {
          widths: ['auto', 125, 125, '*',100, 70],
          body: [

            /* Fila amarilla */
            [
              {
                text: 'VENTAS',
                colSpan: 6,
                color: 'white',
                fillColor: '#CA041A',
                bold: true,
                fontSize: 8,
                margin: [5, 3],
                border: [false, false, false, false]
              },
              {}, {}, {}, {},{}
            ],

            /* Encabezados */
            [
              { text: 'ID', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
              { text: 'CLIENTE', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
              { text: 'DOMICILIO', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
              { text: 'FECHA', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
              { text: 'VENDEDOR', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
              { text: 'TOTAL', bold: true, color: '#B40000', alignment: 'right', fontSize: 8 }
            ],

            /* 🔹 FILAS DINÁMICAS */
            ...bodyData,

            // TOTAL
              [
                { text: 'TOTAL VENTAS', colSpan: 5, bold: true, alignment: 'right', border: [false, false, false, false] }, {},{}, {},{},
                // { text: 'TOTAL VENTAS', bold: true, alignment: 'right', border: [false, false, false, false] },
                {
                  text: `${this.formatCurrency(total )}`, bold: true, alignment: 'right', border: [false, false, false, false]
                }
              ]

          ]
        },

        layout: {
          hLineWidth: (i: number) => i === 1 || i === 2 ? 1.2 : 0.4,
          vLineWidth: () => 0,
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 3,
          paddingBottom: () => 3
        }
      }
    ]
  };

  pdfMake.createPdf(documentDefinition).open();
    }

//REPORTE PRODUCTOS VENDIDOS
      async reportPDFProductos(nameReport: string, data: any[], fechaInicio: string, fechaFin: string) {
  
        const headerImage = img_encabezado.img;
  const footerImage = img_footer.img;

  /* 🔹 Convertir data a filas pdfMake */
  const bodyData = data.map((item, index) => ([
    {
      text: item.id_producto ?? '',
      alignment: 'center',
      fontSize: 8
    },
    {
      text: item.producto ?? '',
      alignment: 'center',
      fontSize: 8
    },
    {
      text: item.total_vendido ?? '',
      alignment: 'center',
      fontSize: 8
    },
    {
      text: `$${Number(item.total_venta?? 0).toLocaleString('es-MX', {
        minimumFractionDigits: 2
      })}`,
      alignment: 'right',
      fontSize: 8
    }
  ]));

  const documentDefinition: any = {
    pageMargins: [40, 120, 40, 120],

    header: {
      image: headerImage,
      width: 570,
      margin: [0, 5]
    },

    footer: {
      image: footerImage,
      width: 550,
      margin: [25, 0]
    },

    content: [

      /* 🔹 Título */
      {
        text: [
          { text: `REPORTE DE ${nameReport.toUpperCase()}\n`, bold: true },
          { text: `Periodo del ${fechaInicio} al ${fechaFin}` }
        ],
        margin: [0, 20],
        fontSize: 12
      },

      /* 🔹 Tabla */
      {
        table: {
          widths: ['auto', '*', 150, 150],
          body: [

            /* Fila amarilla */
            [
              {
                text: 'VENTAS',
                colSpan: 4,
                color: 'white',
                fillColor: '#CA041A',
                bold: true,
                fontSize: 8,
                margin: [5, 3],
                border: [false, false, false, false]
              },
              {}, {}, {}
            ],

            /* Encabezados */
            [
              { text: 'ID', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
              { text: 'PRODUCTO', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
              { text: 'CANTIDAD', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
             
              { text: 'TOTAL', bold: true, color: '#B40000', alignment: 'right', fontSize: 8 }
            ],

            /* 🔹 FILAS DINÁMICAS */
            ...bodyData,

            // TOTAL
              // [
              //   { text: 'TOTAL VENTAS', colSpan: 4, bold: true, alignment: 'right', border: [false, false, false, false] }, {},{}, {},
              //   // { text: 'TOTAL VENTAS', bold: true, alignment: 'right', border: [false, false, false, false] },
              //   {
              //     text: `${this.formatCurrency(total )}`, bold: true, alignment: 'right', border: [false, false, false, false]
              //   }
              // ]

          ]
        },

        layout: {
          hLineWidth: (i: number) => i === 1 || i === 2 ? 1.2 : 0.4,
          vLineWidth: () => 0,
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 3,
          paddingBottom: () => 3
        }
      }
    ]
  };

  pdfMake.createPdf(documentDefinition).open();
    }
}
