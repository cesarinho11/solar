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

    { label: 'Confirmar', icon: 'bi-bag-check', type: 'confirm', class: 'btn btn-primary' },
    { label: 'Descargar', icon: 'bi-file-pdf-fill', type: 'download', class: 'btn btn-warning' },
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
      data
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

    let imgLogo = logo.img;
    let headerImage = img_encabezado.img;
    let footerImage = img_footer.img;
    let precio_unitario_instalacion = 8000;
    let precio_unitario_otros = 0;
    const tableBody = [
      ['Cant.', 'Producto', 'Descripción', 'Precio']
    ];

    this.productosArray.forEach((p: any) => {
      tableBody.push([
        p.cantidad.toString(),
        p.nombre ?? '',
        p.descripcion ?? '',
        `$ ${p.precio_venta}`
      ]);
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
        {
          text: 'Ejemplo de PDF con imagen en encabezado y pie de página.',
          style: 'header'
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
            widths: ['auto', '*', '*', 'auto'],
            body: [

              // Fila amarilla
              [
                { text: '1. EQUIPO Y COMPONENTES', colSpan: 4, fillColor: '#F3CA00', bold: true,fontSize: 8,  color: 'black', alignment: 'left', margin: [5, 3], border: [false, false, false, false] },
                {}, {}, {}
              ],

              // Sub encabezado rojo
              [

                { text: 'CANT', bold: true, color: '#B40000', alignment: 'center',fontSize: 8  },
                { text: 'DESCRIPCIÓN', bold: true, color: '#B40000', alignment: 'center',fontSize: 8 },
                { text: 'P. UNITARIO', bold: true, color: '#B40000', alignment: 'center',fontSize: 8 },
                { text: 'SUBTOTAL', bold: true, color: '#B40000', alignment: 'center',fontSize: 8 }
              ],

              // Filas de productos (expandido correctamente)
              ...this.productosArray.map((p: any) => ([
                { text: p.cantidad?.toString() ?? '', alignment: 'center', fontSize: 9 },
                { text: p.nombre ?? '', alignment: 'center', fontSize: 8 },
                { text: p.descripcion ?? '', alignment: 'center', fontSize: 8 },
                { text: `$${p.precio_venta}`, alignment: 'right', bold: true }
              ])),

              // TOTAL
              [
                { text: '', colSpan: 2, border: [false, true, false, false] }, {},
                { text: 'TOTAL', bold: true, alignment: 'right', border: [false, true, false, false] },
                { text: `$${this.totalGeneral}`, bold: true, alignment: 'right', border: [false, true, false, false] }
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
            widths: ['auto', 'auto', '*', 'auto'],
            body: [

              // Fila amarilla
              [
                { text: '2.INSTALACION', colSpan: 4, fillColor: '#F3CA00', bold: true,fontSize: 8,  color: 'black', alignment: 'left', margin: [5, 3], border: [false, false, false, false] },
                {}, {}, {}
              ],

              // Sub encabezado rojo
              [

                { text: 'CODIGO', bold: true, color: '#B40000', alignment: 'center',fontSize: 8 },
                { text: 'CANT', bold: true, color: '#B40000', alignment: 'center' ,fontSize: 8},
                { text: 'P. UNITARIO', bold: true, color: '#B40000', alignment: 'center',fontSize: 8 },
                { text: 'SUBTOTAL', bold: true, color: '#B40000', alignment: 'center',fontSize: 8 }
              ],

              // Filas de productos (expandido correctamente)
              [
                { text: '0019 ', alignment: 'center', fontSize: 9 },
                { text: 1, alignment: 'center', fontSize: 9 },
                {
                  text: `INSTALACIÓN. MONTAJE DE LA ESTRUCTURA, MONTAJE DE
                  MÓDULOS EN ESTRUCTURA, INSTALACIÓN ELÉCTRICA, MANO DE
                  OBRA EN SU TOTALIDAD HASTA EL PUNTO DE ENCENDIDO DEL
                  INVERSOR.`, alignment: 'center', fontSize: 8
                },
                { text: `$${precio_unitario_instalacion}`, alignment: 'center', fontSize: 8 }
              ]
              ,

              // TOTAL
              [
                { text: '', colSpan: 2, border: [false, true, false, false] }, {},
                { text: 'TOTAL', bold: true, alignment: 'right', border: [false, true, false, false] },
                { text: `$${precio_unitario_instalacion}`, bold: true, alignment: 'right', border: [false, true, false, false] }
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
            widths: ['auto', 'auto', '*', 'auto'],
            body: [

              // Fila amarilla
              [
                { text: '3.OTROS', colSpan: 4, fillColor: '#F3CA00', bold: true,fontSize: 8,  color: 'black', alignment: 'left', margin: [5, 3], border: [false, false, false, false] },
                {}, {}, {}
              ],

              // Sub encabezado rojo
              [

                { text: 'CODIGO', bold: true, color: '#B40000', alignment: 'center',fontSize: 8 },
                { text: 'CANT', bold: true, color: '#B40000', alignment: 'center',fontSize: 8 },
                { text: 'P. UNITARIO', bold: true, color: '#B40000', alignment: 'center',fontSize: 8 },
                { text: 'SUBTOTAL', bold: true, color: '#B40000', alignment: 'center' ,fontSize: 8}
              ],

              // Filas de productos (expandido correctamente)
              [
                { text: '0004 ', alignment: 'center', fontSize: 9 },
                { text: 1, alignment: 'center', fontSize: 9 },
                {
                  text: `RECONOCIMIENTO FISICO. ELABORACIÓN DE UN
                  LEVANTAMIENTO DE LA ZONA EN LA CUAL SE LLEVARÁ A CABO LA
                  INSTALCIÓN, PARA LOGRAR LA MAYOR EFICIENCIA DEL SISTEMA
                  FV.`, alignment: 'center', fontSize: 8
                },
                { text: `$${precio_unitario_otros}`, alignment: 'center', fontSize: 8 }
              ],

              [
                { text: '0010', alignment: 'center', fontSize: 9 },
                { text: 1, alignment: 'center', fontSize: 9 },
                {
                  text: `TRAMITOLOGIA Y DOCUMENTACIÓN. INCLUYE EL TRAMITE ANTE
                  LA COMISIÓN FEDERAL DE ELECTRICIDAD SOLICITANDO EL
                  CAMBIO DE MEDIDOR BIDIRECCIONAL, DIAGRAMA UNIFILAR,
                  ENTRE OTROS DOCUMENTOS.`, alignment: 'center', fontSize: 8
                },
                { text: `$${precio_unitario_otros}`, alignment: 'center', fontSize: 8 }
              ]

              ,

              // TOTAL
              [
                { text: '', colSpan: 2, border: [false, true, false, false] }, {},
                { text: 'TOTAL', bold: true, alignment: 'right', border: [false, true, false, false] },
                { text: `$${precio_unitario_otros}`, bold: true, alignment: 'right', border: [false, true, false, false] }
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
            widths: ['auto', '*'],
            body: [

              // Fila amarilla
              [
                { text: '4.- PRECIO TOTAL DE LA COTIZACIÓN REALIZADA', colSpan: 2,fontSize: 8, fillColor: '#F3CA00', bold: true, color: 'black', alignment: 'left', margin: [5, 3], border: [false, false, false, false] },
                {},
              ],

              // Sub encabezado rojo
              [

                { text: 'DESCRIPCION', bold: true, color: '#B40000', alignment: 'center',fontSize: 8 },
                { text: 'SUBTOTAL', bold: true, color: '#B40000', alignment: 'right',fontSize: 8 }
              ],

              // Filas de productos (expandido correctamente)
              [
                {
                  text: `EQUIPOS Y COMPONENTES`, alignment: 'center', fontSize: 8
                },
                { text: `$${precio_unitario_otros}`, alignment: 'right', fontSize: 8 }
              ],
               [
                {
                  text: `INSTALACIÓN`, alignment: 'center', fontSize: 8
                },
                { text: `$${precio_unitario_otros}`, alignment: 'right', fontSize: 8 }
              ],
              [
                {
                  text: `OTROS`, alignment: 'center', fontSize: 8
                },
                { text: `$${precio_unitario_otros}`, alignment: 'right', fontSize: 8 }
              ]


              ,

              // TOTAL
              [
                { text: 'TOTAL', bold: true, alignment: 'right', border: [false, true, false, false] },
                { text: `$${precio_unitario_otros + this.totalGeneral + precio_unitario_instalacion}`, bold: true, alignment: 'right', border: [false, true, false, false] }
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

  productosCotizacion(datos: any) {
    let data = {
      id: datos.id_cotizacion
    }
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
