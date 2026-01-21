import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalCotizacionComponent } from 'src/app/modals/modal-cotizacion/modal-cotizacion.component';
import { CotizacionService } from 'src/app/services/cotizacion/cotizacion.service';
import Swal from 'sweetalert2';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { logo, img_encabezado, img_footer } from 'src/app/variables/imagenSolar';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss']
})
export class CotizacionesComponent implements OnInit {

  constructor(private cotizacionService: CotizacionService, private dialog: MatDialog) { }

  tableColumns = [
    { key: 'id_cotizacion', label: 'ID Cotizacion' },
    { key: 'nombre', label: 'Cliente' },
    { key: 'domicilio_instalacion', label: 'domicilio_instalacion' },
    { key: 'telefono', label: 'telefono' },
    { key: 'total', label: 'total' },
    { key: 'total_venta', label: 'Total venta' },
  ];

  tableActions = [
    { label: 'Descargar', icon: 'bi-file-pdf-fill', type: 'download', class: 'btn btn-default' },
    { label: 'Confirmar', icon: 'bi-bag-check', type: 'confirm', class: 'btn btn-primary' },
    { label: 'Editar', icon: 'bi-pencil-square', type: 'edit', class: 'btn btn-success' },
    { label: 'Eliminar', icon: 'bi-trash', type: 'delete', class: 'btn btn-danger' }
  ];
  tableData: any
  currentPage = 1;
  lastPage = 1;
  search = '';

  ngOnInit(): void {
    this.loadProductos()
  }

  loadProductos(page: number = 1) {

    this.cotizacionService.getCotizaciones(page, this.search).subscribe({
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
      this.loadProductos(page);
    }
  }

  buscar() {
    this.loadProductos();
  }

  addCliente() {

  }

  onTableAction(event: { action: string; row: any }) {
    if (event.action === 'edit') {
      event.row.accion = event.action;
      console.log('Editar →', event.row);
      let data = event.row;
      data.accion = 'editar'
      this.openDialog(data)

    } else if (event.action === 'confirm') {
      event.row.accion = event.action;
      console.log('Confirmar cotizacion →', event.row);
      this.confirmarCotizacion(event.row.id_cotizacion);

    }
    else if (event.action === 'delete') {
      event.row.accion = event.action;
      console.log('Eliminar →', event.row);
    } else if (event.action === 'download') {
      console.log('download →', event.row);
      this.productosCotizacion(event.row)

    }
  }

  addProducto() {
    let data = { accion: 'nuevo' }
    this.openDialog(data)
  }


  openDialog(data: any): void {
    var dialogRef = this.dialog.open(ModalCotizacionComponent, {
      width: '100%',
      data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event == 'Agregar') {
        this.loadProductos();
      } else if (result.event == 'Cancel') {
        this.loadProductos();
      }

    });

  }


  confirmarCotizacion(id_cotizacion: number) {
    Swal.fire({
      title: '¿Estás seguro de confirmar la cotizacion?',
      text: "",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {

        // 👉 AQUÍ LLAMAS TU SERVICIO SI CONFIRMA
        let data = { id: id_cotizacion }
        this.cotizacionService.confirmarCotizacion(data).subscribe({
          next: (res: any) => {
            Swal.fire('Confirmado', 'La cotización fue confirmada correctamente', 'success');
            console.log(res);
            this.loadProductos();
          },
          error: (err: any) => {
            Swal.fire('Error', 'No se pudo eliminar', 'error');
            console.log(err);
          }
        });

      }
    });
  }

  async generatePDF() {
    console.log('dataaaaaaaaaaaaaa',this.data_Cotizacion)

    let imgLogo = logo.img;
    let headerImage = img_encabezado.img;
    let footerImage = img_footer.img;
    let precio_unitario_instalacion = 8000;
    let precio_unitario_otros = 0;
    const tableBody = [
      ['Cant.', 'Producto', 'Descripción', 'Precio']
    ];

    this.productosArray.forEach((p: any) => {
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
        // {
        //   text: 'Ejemplo de PDF con imagen en encabezado y pie de página.',
        //   style: 'header'
        // },
        {
          table: {
             widths: ['auto', '*', 'auto', '*','auto','auto'],
            body: [

              // Fila amarilla
              [
                { text: 'DATOS CLIENTE', colSpan: 2, fillColor: '#F3CA00', bold: true, fontSize: 8, color: 'black', alignment: 'center', margin: [5, 3], border: [false, false, false, false] },
                {}, // ← celda vacía por colSpan 2
                 { text: 'DATOS PROYECTO', colSpan:4, fillColor: '#F3CA00', bold: true, fontSize: 8, color: 'black', alignment: 'center', margin: [5, 3], border: [false, false, false, false] },
                    {},
                    {},
                    {}
              ],

              // Sub encabezado rojo
              [

                { text: 'NOMBRE', bold: true, alignment: 'left', fontSize: 8 ,border: [true, true, true, true]},
                { text: this.data_Cotizacion.nombre, bold: false, alignment: 'left', fontSize: 8,border: [true, true, true, true] },
                { text: 'INT. ELECTRICA', bold: true, alignment: 'left', fontSize: 8 ,border: [true, true, true, true]},
                { text: this.data_Cotizacion.inst_electrica, bold: false,  alignment: 'left', fontSize: 8, border: [true, true, true, true] },
                { text: 'MAT. MONAJE ', bold: true, alignment: 'left', fontSize: 8 ,border: [true, true, true, true]},
                { text: this.data_Cotizacion.mat_montaje, bold: false, alignment: 'left', fontSize: 8,border: [true, true, true, true] }
              ],
              [

                { text: 'NO. SERVICIO', bold: true, alignment: 'left', fontSize: 8 },
                { text: this.data_Cotizacion.id_cotizacion, bold: false, alignment: 'left', fontSize: 8 },
                { text: 'DEMANDA KW/BIM', bold: true, alignment: 'left', fontSize: 8 },
                { text: this.data_Cotizacion.demanda_kw, bold: false, alignment: 'left', fontSize: 8 },
                { text: 'MODULO FV', bold: true, alignment: 'left', fontSize: 8 },
                { text: this.data_Cotizacion.modulo_fv, bold: false, alignment: 'left', fontSize: 8 }
              ],
              [

                { text: 'DOMICILIO', bold: true, alignment: 'left', fontSize: 8 },
                { text: this.data_Cotizacion.domicilio, bold: false,  alignment: 'left', fontSize: 8 },
                { text: 'TENSIÓN DESFASADA', bold: true,  alignment: 'left', fontSize: 8 },
                { text: this.data_Cotizacion.tension, bold: false, alignment: 'left', fontSize: 8 },
                { text: 'N. DE MOD', bold: true, alignment: 'left', fontSize: 8 },
                { text: this.data_Cotizacion.n_mod, bold: false,  alignment: 'left', fontSize: 8 }
              ],
              [

                { text: 'TEL /CEL', bold: true,  alignment: 'left', fontSize: 8 },
                { text: this.data_Cotizacion.telefono, bold: false,  alignment: 'left', fontSize: 8 },
                { text: 'SISTEMA FOTOVOLTAICO', bold: true,  alignment: 'left', fontSize: 8 },
                { text: this.data_Cotizacion.s_fotovoltaico, bold: false, alignment: 'left', fontSize: 8 },
                { text: 'INVERSOR', bold: true,  alignment: 'left', fontSize: 8 },
                { text: this.data_Cotizacion.inversor, bold: false,  alignment: 'left', fontSize: 8 }
              ],

            ]
          },

          layout: {
   hLineWidth: function (i:any, node:any) {
    if (i <= 1) return 0;
    return 0.8;
  },

  // <-- aquí devolvemos 0.8 también para i === 0
  vLineWidth: function (i:any, node:any) {
    return 0.8;
  },
            paddingLeft: function () { return 4; },
            paddingRight: function () { return 4; },
            paddingTop: function () { return 3; },
            paddingBottom: function () { return 3; }
          }
        },
        {

          text: [
            { text: `ESTIMADO ${this.cliente}:\n`.toUpperCase(), bold: true },

            {
              text:
                'Reciba usted un cordial saludo por parte de ',
            },
            { text: 'VAZCO Solar  y todo su equipo que la conforman.', bold: true },

            {
              text:
                'El objetivo de la presente es darle a conocer la ',
            },
            { text: 'COTIZACIÓN', bold: true },
            { text: ' del ' },
            { text: 'sistema de módulos fotovoltaicos ', bold: true },
            {
              text:
                ' en su domicilio, todo esto sin compromiso alguno.\n\n'
            },

            {
              text:
                'Con base a la previa conversación, donde se propuso la alternativa de realizar una ',
            },
            { text: 'INVERSIÓN', bold: true },
            {
              text:
                ', la cual se conforma en la implementación de un sistema de módulos fotovoltaicos y así poder deslindarse del pago bimestral por energía eléctrica.\n\n'
            },

            {
              text: 'VAZCO Solar le ofrece un sistema conformado de ',
            },
            { text: '8 módulos fotovoltaicos ', bold: true },
            {
              text: 'con una potencia de',
            },
            { text: '545 W/h', bold: true },

            {
              text:
                ' cada uno ',
            },
            { text: 'MONOCRISTALINOS, y 1 INVERSOR CENTRAL de 10,000 W/h ', bold: true },
            {
              text:
                ' respectivamente, produciendo un total de ',
            },
            { text: '4,360 Wh bimestrales.', bold: true }
          ],
          margin: [0, 20],
          fontSize: 8,
        },
        {
          table: {
             widths: ['auto', 'auto', '*', 'auto','auto'],
            body: [

              // Fila amarilla
              [
                { text: '1. EQUIPO Y COMPONENTES', colSpan: 5, fillColor: '#F3CA00', bold: true, fontSize: 8, color: 'black', alignment: 'left', margin: [5, 3], border: [false, false, false, false] },
                {}, {}, {},{}
              ],

              // Sub encabezado rojo
              [

                { text: 'CODIGO', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
                { text: 'CANT', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
                { text: 'DESCRIPCION', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
                { text: 'P. UNITARIO', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
                { text: 'SUBTOTAL', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 }
              ],
             
              // Filas de productos (expandido correctamente)
              ...this.productosArray.filter((p: any) => Number(p?.categoria) === 1).map((p: any) => ([
                { text: p.codigo?.toString() ?? '', alignment: 'left', fontSize: 9 },
                { text: p.cantidad ?? '', alignment: 'left', fontSize: 8 },
                {
                  text: [
                    { text: p.nombre + ' ', bold: true },   // nombre en negritas
                    { text: p.descripcion ?? '' }           // descripción normal
                  ],
                  alignment: 'left',
                  fontSize: 8
                },
                { text: `$${p.precio_venta}`, alignment: 'right', bold: true },
                { text: `$${p.total_partida_venta}`, alignment: 'right', bold: true }
              ])),

              // TOTAL
              [
                { text: '', colSpan: 2, border: [false, false, false, false] }, {},{}, 
                { text: 'TOTAL', bold: true, alignment: 'right', border: [false, false, false, false] },
                {
                  text: `$${this.productosArray
                    .filter((p: any) => Number(p?.categoria) === 1)
                    .reduce((acc: number, p: any) => acc + (p.cantidad * p.precio_venta), 0)}`, bold: true, alignment: 'right', border: [false, false, false, false]
                }
              ]
            ]
          },

          layout: {
            hLineWidth: function (i: any, node: any) {
              return i === 1 || i === 2 ? 1.2 : 0.4;  // líneas como en la imagen
            },

            vLineWidth: function (i: number, node: any) {
              // 0 = SIN BORDES VERTICALES
              return 0;
            },
            paddingLeft: function () { return 4; },
            paddingRight: function () { return 4; },
            paddingTop: function () { return 3; },
            paddingBottom: function () { return 3; }
          }
        },
        {
          table: {
            widths: ['auto', 'auto', '*', 'auto','auto'],
            body: [

              // Fila amarilla
              [
                { text: '2.INSTALACION', colSpan: 5, fillColor: '#F3CA00', bold: true, fontSize: 8, color: 'black', alignment: 'left', margin: [5, 3], border: [false, false, false, false] },
                {}, {}, {},{}
              ],

              // Sub encabezado rojo
              [

                { text: 'CODIGO', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
                { text: 'CANT', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
                { text: 'DESCRIPCION', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
                { text: 'P. UNITARIO', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
                { text: 'SUBTOTAL', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 }
              ],

              // Filas de productos (expandido correctamente)
              ...this.productosArray.filter((p: any) => Number(p?.categoria) === 2).map((p: any) => ([
                { text: p.codigo?.toString() ?? '', alignment: 'center', fontSize: 9 },
                { text: p.cantidad ?? '', alignment: 'center', fontSize: 8 },
                {
                  text: [
                    { text: p.nombre + ' ', bold: true },   // nombre en negritas
                    { text: p.descripcion ?? '' }           // descripción normal
                  ],
                  alignment: 'center',
                  fontSize: 8
                },
                { text: `$${p.precio_venta}`, alignment: 'right', bold: true },
                { text: `$${p.total_partida_venta}`, alignment: 'right', bold: true }
              ])),


              // TOTAL
              [
                { text: '', colSpan: 3, border: [false, true, false, false] }, {}, {}, 
                { text: 'TOTAL', bold: true, alignment: 'right', border: [false, true, false, false] },
                { text: `$${this.productosArray
                    .filter((p: any) => Number(p?.categoria) === 2)
                    .reduce((acc: number, p: any) => acc + (p.cantidad * p.precio_venta), 0)}`, bold: true, alignment: 'right', border: [false, true, false, false] }
              ]
            ]
          },

          layout: {
            hLineWidth: function (i: any, node: any) {
              return i === 1 || i === 2 ? 1.2 : 0.4;  // líneas como en la imagen
            },

            vLineWidth: function (i: number, node: any) {
              // 0 = SIN BORDES VERTICALES
              return 0;
            },
            paddingLeft: function () { return 4; },
            paddingRight: function () { return 4; },
            paddingTop: function () { return 3; },
            paddingBottom: function () { return 3; }
          }
        },
        {
          table: {
            widths: ['auto', 'auto', '*', 'auto','auto'],
            body: [

              // Fila amarilla
              [
                { text: '3.OTROS', colSpan: 5, fillColor: '#F3CA00', bold: true, fontSize: 8, color: 'black', alignment: 'left', margin: [5, 3], border: [false, false, false, false] },
                {}, {}, {},{}
              ],

              // Sub encabezado rojo
              [

                { text: 'CODIGO', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
                { text: 'CANT', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
                { text: 'DESCRIPCION', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
                { text: 'P. UNITARIO', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 },
                { text: 'SUBTOTAL', bold: true, color: '#B40000', alignment: 'center', fontSize: 8 }
              ],
             
              // Filas de productos (expandido correctamente)
              ...this.productosArray.filter((p: any) => Number(p?.categoria) === 3).map((p: any) => ([
                { text: p.codigo?.toString() ?? '', alignment: 'center', fontSize: 9 },
                { text: p.cantidad ?? '', alignment: 'center', fontSize: 8 },
                {
                  text: [
                    { text: p.nombre + ' ', bold: true },   // nombre en negritas
                    { text: p.descripcion ?? '' }           // descripción normal
                  ],
                  alignment: 'center',
                  fontSize: 8
                },
                { text: `$${p.precio_venta}`, alignment: 'right', bold: true },
                { text: `$${p.total_partida_venta}`, alignment: 'right', bold: true }
              ])),


              // TOTAL
              [
                { text: '', colSpan: 3, border: [false, true, false, false] }, {}, {}, 
                { text: 'TOTAL', bold: true, alignment: 'right', border: [false, true, false, false] },
                { text: `$${this.productosArray
                    .filter((p: any) => Number(p?.categoria) === 2)
                    .reduce((acc: number, p: any) => acc + (p.cantidad * p.precio_venta), 0)}`, bold: true, alignment: 'right', border: [false, true, false, false] }
              ]
            ]
          },

          layout: {
            hLineWidth: function (i: any, node: any) {
              return i === 1 || i === 2 ? 1.2 : 0.4;  // líneas como en la imagen
            },

            vLineWidth: function (i: number, node: any) {
              // 0 = SIN BORDES VERTICALES
              return 0;
            },
            paddingLeft: function () { return 4; },
            paddingRight: function () { return 4; },
            paddingTop: function () { return 3; },
            paddingBottom: function () { return 3; }
          }
        },
        {
          table: {
            widths: [50,'auto', '*'],
            body: [

              // Fila amarilla
              [

                { text: '4.- PRECIO TOTAL DE LA COTIZACIÓN REALIZADA', colSpan: 3, fontSize: 8, fillColor: '#F3CA00', bold: true, color: 'black', alignment: 'left', margin: [5, 3], border: [false, false, false, false] },
                {},
                {},
              ],

              // Sub encabezado rojo
              [

                { text: '' },
                { text: 'DESCRIPCION', bold: true, color: '#B40000', alignment: 'left', fontSize: 8 },
                { text: 'SUBTOTAL', bold: true, color: '#B40000', alignment: 'right', fontSize: 8 }
              ],

              // Filas de productos (expandido correctamente)
              [
                {},
                {
                  text: `EQUIPOS Y COMPONENTES`, alignment: 'left', fontSize: 8
                },
                { text: `$${this.productosArray
                    .filter((p: any) => Number(p?.categoria) === 1)
                    .reduce((acc: number, p: any) => acc + (p.cantidad * p.precio_venta), 0)}`, alignment: 'right', fontSize: 8 }
              ],
              [
                 {},
                {
                  text: `INSTALACIÓN`, alignment: 'left', fontSize: 8
                },
                { text: `$${this.productosArray
                    .filter((p: any) => Number(p?.categoria) === 2)
                    .reduce((acc: number, p: any) => acc + (p.cantidad * p.precio_venta), 0)}`, alignment: 'right', fontSize: 8 }
              ],
              [
                 {},
                {
                  text: `OTROS`, alignment: 'left', fontSize: 8
                },
                { text: `$${this.productosArray
                    .filter((p: any) => Number(p?.categoria) === 3)
                    .reduce((acc: number, p: any) => acc + (p.cantidad * p.precio_venta), 0)}`, alignment: 'right', fontSize: 8 }
              ]


              ,

              // TOTAL
              [

                { text: 'TOTAL', colSpan: 2, bold: true, alignment: 'right', border: [false, true, false, false] },
                                {},
                { text: `$${this.productosArray
                    .filter((p: any) => Number(p?.categoria))
                    .reduce((acc: number, p: any) => acc + (p.cantidad * p.precio_venta), 0)}`, bold: true, alignment: 'right', border: [false, true, false, false] }
              ]
            ]
          },

          layout: {
            hLineWidth: function (i: any, node: any) {
              return i === 1 || i === 2 ? 1.2 : 0.4;  // líneas como en la imagen
            },

            vLineWidth: function (i: number, node: any) {
              // 0 = SIN BORDES VERTICALES
              return 0;
            },
            paddingLeft: function () { return 4; },
            paddingRight: function () { return 4; },
            paddingTop: function () { return 3; },
            paddingBottom: function () { return 3; }
          }
        },

        {
          text: `\nNOTA `,
bold: true ,color: '#B40000', alignment: 'center', fontSize: 8
         
        },
        {
    text: `\n\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            *PRECIOS EN MONEDA NACIONAL
*COTIZACIÓN CON VIGENCIA DE 15 DÍAS A PARTIR DE SU EMISIÓN \n
*PRECIO TOTAL NEGOCIABLE (APLICA SOLAMENTE EN COMPRA DE CONTADO)\n`,
bold: true, fontSize: 8
        },
        {
    text: `\n\nEn seguida le explicaremos la modalidad de pago para su `, fontSize: 8
        },
        {
    text: `PROYECTO \n`,
bold: true, fontSize: 8
        },
        {

        },
         {text: [
          {    text: `COMPRA DE CONTADO:\n`,bold: true, fontSize: 8},
          {    text: `La compra de contado está dividida en tres pagos que se realizan al inicio, durante y finalizando la instalación poniendo en marcha	el inversor para que el sistema comience a trabajar.\n\n`,fontSize: 8},
{    text: `Contrato:\n`,bold: true, fontSize: 8},
{    text: `de por medio, este pago consta del 70% del precio total.\n \n`,fontSize: 8},
{    text: `2do PAGO:`,bold: true, fontSize: 8},
{    text: `Pago que se realiza en el transcurso de la instalación, poniendo en claro que a estas alturas usted ya debe de tener los								
módulos e inversor en su establecimiento, este pago consta del 20% del precio total.			\n\n`, fontSize: 8},
{    text: `3er PAGO:`,bold: true, fontSize: 8},
{    text: `Pago que se realiza al finalizar el proyecto que consiste en el encendido de los inversores y una vez corroborando que el								
sistema esté funcionando, este pago consta del 10% del precio total llegando al 100% y finiquitando su compra.		\n\n`, fontSize: 8},
        ]},
        {
          text: `				
Sin más que decir quedamos a su total disposición para cualquier duda o aclaración, saludos nuevamente de \n VAZCO Solar “cuidemos nuestro medio ambiente y prosperemos juntos”.				
`,
bold: true,fontSize: 8, alignment: 'center'
         
        },
        {
          text: `		\n\n		
ATENTAMENTE\n\n
ING. SAUL OROZCO MALDONADO\n\n
GERENTE DE VAZCO SOLAR \n
312 256 0275
.				
`,
bold: true,fontSize: 8, alignment: 'center'
         
        }
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
  subTotal: any;
  totalGeneral: any;
  productosArray: any
  cliente: any;
  data_Cotizacion:any;

  productosCotizacion(datos: any) {
    let data = {
      id: datos.id_cotizacion
    }

    this.data_Cotizacion = datos;
    console.log(datos)
    this.cliente = datos.nombre;
    this.cotizacionService.productosCotizacion(data).subscribe({
      next: (res: any) => {
        console.log(res);
        this.productosArray = res;
        this.subTotal;
        this.totalGeneral = datos.total_venta;
        console.log('productos cotizacion', this.productosArray)
        console.log('', this.cliente)
        console.log(' cotizacion', this.totalGeneral)
        this.generatePDF();
      },
      error: (err: any) => {
        console.log('error', err);
      }
    });
  }


}
