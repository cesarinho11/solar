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
export class PdfCotizacionService {

  constructor() { }

  // this.formatCurrency(value: number | string) {
  //   return new Intl.NumberFormat('es-MX', {
  //     style: 'currency',
  //     currency: 'MXN',
  //     minimumFractionDigits: 2
  //   }).format(Number(value || 0));
  // }
  chek = {
    svg: `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#F4C430" stroke="white" stroke-width="3"/>
      <path d="M12 21.5 L18 27 L28 14"
            fill="none"
            stroke="white"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"/>
    </svg>
  `,
    width: 20
  };

  roundedCell(
    text: string,
    options: {
      bg?: string;
      color?: string;
      bold?: boolean;
      center?: boolean;
      colSpan?: number;
    } = {}
  ) {
    return {
      colSpan: options.colSpan || 1,
      stack: [
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: options.colSpan ? 350 : 170,
              h: 16,
              r: 4,
              color: options.bg || '#ffffff',
              // lineColor: '#dddddd'
              lineColor: '#d60000'
            }
          ]
        },
        {
          text,
          fontSize: 8,
          bold: options.bold || false,
          color: options.color || '#000',
          alignment: options.center ? 'center' : 'left',
          margin: [6, -13, 6, 0]
        }
      ],
      margin: [2, 2, 2, 2]
    };
  }

  roundedCell2(
    text: string,
    options: {
      bg?: string;
      color?: string;
      bold?: boolean;
      center?: boolean;
      colSpan?: number;
      width?: number;
      lineColor?: string;
      heigth?: number;
    } = {}
  ) {
    return {
      colSpan: options.colSpan || 1,
      stack: [
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: options.width ?? (options.colSpan ? 490 : 100),
              h: options.heigth ?? 16,
              r: 4,
              color: options.bg || '#ffffff',
              // lineColor: '#dddddd'
              lineColor: options.lineColor ?? '#eee'
            }
          ]
        },
        {
          text,
          fontSize: 8,
          bold: options.bold || false,
          color: options.color || '#000',
          alignment: options.center ? 'center' : 'left',
          margin: [6, -13, 6, 0]
        }
      ],
      margin: [2, 2, 2, 2]
    };
  }



  formatCurrency = (value: number | string): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(Number(value ?? 0));
  };


  async generatePDF(data: any, cotizacion: any) {
    console.log('data en servicio', data)
    console.log('entro pdf desde servicio', cotizacion)

    let imgLogo = logo.img;
    let headerImage = img_encabezado.img;
    let footeMarcas = marcas.img;
    let footerImage = img_footer.img;
    let precio_unitario_instalacion = 8000;
    let precio_unitario_otros = 0;
    const tableBody = [
      ['Cant.', 'Producto', 'Descripción', 'Precio']
    ];

    data.productosArray.forEach((p: any) => {
      if (p.categoria === 1) {
        console.log(p.categoria)
        tableBody.push([
          p.cantidad.toString(),
          p.nombre ?? '',
          p.descripcion ?? '',
          `$ ${p.precio_venta}`
        ]);
      }

    });

    const tablaEncabezado = {
      margin: [0, 0, 0, 25],
      stack: [

        // 🔴 Fondo rojo con esquinas redondeadas
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 515,
              h: 90,
              r: 14,
              color: '#d60000'
            }
          ]
        },

        // 📋 Tabla interna
        {
          margin: [12, -75, 12, 0],
          table: {
            widths: [58, '*', 58, '*'],
            body: [
              [
                this.roundedCell('FECHA', { bg: '#d60000', color: 'white', bold: true }),
                this.roundedCell(cotizacion.fecha_cotizacion),
                this.roundedCell('FOLIO', { bg: '#d60000', color: 'white', bold: true }),
                this.roundedCell(cotizacion.id_cotizacion)
              ],
              [
                this.roundedCell('NOMBRE', { bg: '#d60000', color: 'white', bold: true }),
                this.roundedCell(cotizacion.nombre),
                this.roundedCell('DOMICILIO', { bg: '#d60000', color: 'white', bold: true }),
                this.roundedCell(cotizacion.domicilio),
              ],
              [
                this.roundedCell('TEL/CEL', { bg: '#d60000', color: 'white', bold: true }),
                this.roundedCell(cotizacion.telefono),
                this.roundedCell('CORREO', { bg: '#d60000', color: 'white', bold: true }),
                this.roundedCell(cotizacion.correo)
              ]
            ]
          },
          layout: 'noBorders'
        }
      ]
    };

    const documentDefinition: any = {
      pageMargins: [40, 120, 40, 120],

      header: {
        image: headerImage,
        width: 570,
        margin: [0, 5]
      },

      // footer: {
      //   image: footeMarcas+footerImage,
      //   width: 550,
      //   margin: [25, 0]
      // },

footer: {
  stack: [
    {
      image: footeMarcas,
      width: 380,
      alignment: 'center',
      margin: [0, 0, 0, 1] // espacio entre imágenes
    },
    {
      image: footerImage,
      width: 550,
      alignment: 'center'
    }
  ],
  margin: [25, 0]
},

      content: [
        tablaEncabezado,
        {
          margin: [0, 0, 0, 10],
          table: {
            widths: ['auto', 'auto', 250, '*', '*'],
            body: [
              [
                { text: 'EQUIPO Y COMPONENTES', colSpan: 5, fillColor: '#d60000', bold: true, color: 'white', fontSize: 8 },
                {}, {}, {}, {}
              ],
              [
                { text: 'CODIGO', bold: true, alignment: 'center', fontSize: 8 },
                { text: 'CANT', bold: true, alignment: 'center', fontSize: 8 },
                { text: 'DESCRIPCION', bold: true, alignment: 'center', fontSize: 8 },
                { text: 'P. UNITARIO', bold: true, alignment: 'center', fontSize: 8 },
                { text: 'SUBTOTAL', bold: true, alignment: 'center', fontSize: 8 }
              ],
              ...data.productosArray
                .filter((p: any) => Number(p?.categoria) === 1 || Number(p?.categoria) === 2 )
                .map((p: any) => ([
                  { text: p.codigo ?? '', fontSize: 8 },
                  { text: p.cantidad ?? '', fontSize: 8 },
                  {
                    text: [
                      { text: p.nombre + ' ', bold: true },
                      //  { text: ' | ',    fontSize:12, bold: true ,  color: '#F3CA00'},
                      { text: p.marca ? ' Marca: ' + p.marca : '' },

                      { text: p.potencia ? ' - Potencia: ' + p.potencia :'' },
                      { text: p.modelo ? ' Modelo: ' + p.modelo : '' },
                    ],
                    fontSize: 8
                  },
                  { text: this.formatCurrency(p.precio_venta), alignment: 'right', bold: true, fontSize: 8 },
                  { text: this.formatCurrency(p.total_partida_venta), alignment: 'right', bold: true,  fontSize: 8 }
                ]))
            ]
          },
          layout: {
            hLineWidth: () => 0.8,
            vLineWidth: () => 0.8,
            hLineColor: () => '#eee',
            vLineColor: () => '#eee',
            paddingLeft: () => 3,
            paddingRight: () => 3,
            paddingTop: () => 3,
            paddingBottom: () => 3
          }
        },
        // {
        //   margin: [0, 0, 0, 10],
        //   table: {
        //     widths: ['auto', 'auto', 250, '*', '*'],
        //     body: [

        //       // Fila amarilla
        //       [
        //         { text: 'INSTALACION Y OTROS',  colSpan: 5, fillColor: '#d60000', bold: true, color: 'white', fontSize: 8 },
        //         {}, {}, {}, {}
        //       ],

        //       // Sub encabezado rojo
        //       [
        //         { text: 'CODIGO', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
        //         { text: 'CANT', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
        //         { text: 'DESCRIPCION', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
        //         { text: 'P. UNITARIO', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
        //         { text: 'SUBTOTAL', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 }
        //       ],

        //       // Filas de productos (expandido correctamente)
        //       ...data.productosArray.filter((p: any) => Number(p?.categoria) === 2 || Number(p?.categoria) === 3 ).map((p: any) => ([
        //         { text: p.codigo?.toString() ?? '', alignment: 'center', fontSize: 9 },
        //         { text: p.cantidad ?? '', alignment: 'center', fontSize: 8 },
        //         {
        //           text: [
        //             { text: p.nombre + ' ', bold: true },   // nombre en negritas
        //             { text: p.descripcion ?? '', fontSize: 6 }           // descripción normal
        //           ],
        //           alignment: 'center',
        //           fontSize: 8
        //         },
        //         { text: `${this.formatCurrency(p.precio_venta)}`, alignment: 'right', bold: true, fontSize: 8 },
        //         { text: `${this.formatCurrency(p.total_partida_venta)}`, alignment: 'right', bold: true,  fontSize: 8 }
        //       ])),


        //       // TOTAL
        //       // [
        //       //   { text: '', colSpan: 3, border: [false, true, false, false] }, {}, {},
        //       //   { text: 'TOTAL', bold: true, alignment: 'right', border: [false, true, false, false] },
        //       //   {
        //       //     text: `${this.formatCurrency(data.productosArray
        //       //       .filter((p: any) => Number(p?.categoria) === 2 || Number(p?.categoria) === 3)
        //       //       .reduce((acc: number, p: any) => acc + (p.cantidad * p.precio_venta), 0))}`, bold: true, alignment: 'right', border: [false, true, false, false]
        //       //   }
        //       // ]
        //     ]
        //   },

        //   layout: {
        //     hLineWidth: () => 0.8,
        //     vLineWidth: () => 0.8,
        //     hLineColor: () => '#eee',
        //     vLineColor: () => '#eee',
        //     paddingLeft: () => 8,
        //     paddingRight: () => 8,
        //     paddingTop: () => 6,
        //     paddingBottom: () => 6
        //   }
        // },



        // {
        //   table: {
        //     widths: ['auto', 'auto', 250, '*', '*'],
        //     body: [

        //       // Fila amarilla
        //       [
        //         { text: '3.OTROS',  colSpan: 5, fillColor: '#d60000', bold: true, color: 'white', fontSize: 8 },
        //         {}, {}, {}, {}
        //       ],

        //       // Sub encabezado rojo
        //       [

        //         { text: 'CODIGO', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
        //         { text: 'CANT', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
        //         { text: 'DESCRIPCION', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
        //         { text: 'P. UNITARIO', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
        //         { text: 'SUBTOTAL', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 }
        //       ],

        //       // Filas de productos (expandido correctamente)
        //       ...data.productosArray.filter((p: any) => Number(p?.categoria) === 3).map((p: any) => ([
        //         { text: p.codigo?.toString() ?? '', alignment: 'center', fontSize: 9 },
        //         { text: p.cantidad ?? '', alignment: 'center', fontSize: 8 },
        //         {
        //           text: [
        //             { text: p.nombre + ' ', bold: true },   // nombre en negritas
        //             { text: p.descripcion ?? '', fontSize: 6 }           // descripción normal
        //           ],
        //           alignment: 'center',
        //           fontSize: 8
        //         },
        //         { text: `${this.formatCurrency(p.precio_venta)}`, alignment: 'right', bold: true,  fontSize: 8 },
        //         { text: `${this.formatCurrency(p.total_partida_venta)}`, alignment: 'right', bold: true,  fontSize: 8 }
        //       ])),


        //       // TOTAL
        //       [
        //         { text: '', colSpan: 3, border: [false, true, false, false] }, {}, {},
        //         { text: 'TOTAL', bold: true, alignment: 'right', border: [false, true, false, false] },
        //         {
        //           text: `${this.formatCurrency(data.productosArray
        //             .filter((p: any) => Number(p?.categoria) === 3)
        //             .reduce((acc: number, p: any) => acc + (p.cantidad * p.precio_venta), 0))}`, bold: true, alignment: 'right', border: [false, true, false, false]
        //         }
        //       ]
        //     ]
        //   },

        //   layout: {
        //     hLineWidth: () => 0.8,
        //     vLineWidth: () => 0.8,
        //     hLineColor: () => '#eee',
        //     vLineColor: () => '#eee',
        //     paddingLeft: () => 8,
        //     paddingRight: () => 8,
        //     paddingTop: () => 6,
        //     paddingBottom: () => 6
        //   }
        // },
        {
          margin: [300,0, 0, 0],
          table: {
            widths: [ 100, 80],
            body: [

              // Fila amarilla
              [

                { text: 'PRECIO TOTAL DE LA COTIZACIÓN REALIZADA',  colSpan:2, fillColor: '#d60000', bold: true, color: 'white', fontSize: 8 },
                {},
              ],

              // Sub encabezado rojo
              [

               
                { text: 'DESCRIPCION', bold: true, color: '#B40000', alignment: 'left', fontSize: 8 },
                { text: 'SUBTOTAL', bold: true, color: '#B40000', alignment: 'right', fontSize: 8 }
              ],

              // Filas de productos (expandido correctamente)
              [
 
                {
                  text: `EQUIPOS Y COMPONENTES`, alignment: 'left', fontSize: 8
                },
                {
                  text: `${this.formatCurrency(data.productosArray
                    .filter((p: any) => Number(p?.categoria) === 1)
                    .reduce((acc: number, p: any) => acc + (p.cantidad * p.precio_venta), 0))}`, alignment: 'right', fontSize: 8
                }
              ],
              [
         
                {
                  text: `INSTALACIÓN`, alignment: 'left', fontSize: 8
                },
                {
                  text: `${this.formatCurrency(data.productosArray
                    .filter((p: any) => Number(p?.categoria) === 2)
                    .reduce((acc: number, p: any) => acc + (p.cantidad * p.precio_venta), 0))}`, alignment: 'right', fontSize: 8
                }
              ],
              // [
         
              //   {
              //     text: `OTROS`, alignment: 'left', fontSize: 8
              //   },
              //   {
              //     text: `${this.formatCurrency(data.productosArray
              //       .filter((p: any) => Number(p?.categoria) === 3)
              //       .reduce((acc: number, p: any) => acc + (p.cantidad * p.precio_venta), 0))}`, alignment: 'right', fontSize: 8
              //   }
              // ]


              // ,

              // TOTAL
              [

                { text: 'TOTAL',  bold: true, alignment: 'right', border: [false, true, false, false] },
           
                {
                  text: `${this.formatCurrency(data.productosArray
                    .filter((p: any) => Number(p?.categoria))
                    .reduce((acc: number, p: any) => acc + (p.cantidad * p.precio_venta), 0))}`, bold: true,fillColor: '#F3CA00', color: 'black', alignment: 'right', border: [false, true, false, false]
                }
              ]
            ]
          },

          layout: {
            hLineWidth: () => 0.8,
            vLineWidth: () => 0.8,
            hLineColor: () => '#eee',
            vLineColor: () => '#eee',
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 6,
            paddingBottom: () => 6
          }
        },

      
      ],

      styles: {
        header: {
          fontSize: 12,
          bold: true
        }
      }
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}
