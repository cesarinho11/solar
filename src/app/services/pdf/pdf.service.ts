import { Injectable } from '@angular/core';
import { PDFDocument, PDFName } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  async llenarContraprestacion(userData: any) {
    // 1. Cargar PDF desde assets
    //const existingPdfBytes = await fetch('/assets/documentos/ContratoDeContraprestacion.pdf').then(res => res.arrayBuffer());
    const existingPdfBytes = await fetch('/assets/documentos/Contraprestacion2.pdf').then(res => res.arrayBuffer());

    // 2. Cargar documento
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // 3. Obtener formulario
    const form = pdfDoc.getForm();

    // 4. Centrar todos los campos del PDF (justificación)
    const fields = form.getFields();
    fields.forEach(field => {
      try {
        const acroField: any = (field as any).acroField;
        if (acroField && acroField.dict) {
          // 0 = izquierda, 1 = centrado, 2 = derecha
          acroField.dict.set(PDFName.of('Q'), pdfDoc.context.obj(1));
        }
      } catch (err) {
        console.warn('⚠️ No se pudo centrar el campo:', field.getName());
      }
    });

    //form.getTextField('undefined_18').setText('PRUEBA 18'); //bajo el numero 
    form.getTextField('nvnvbnb').setText('PRUEBAAAAAAAAAA ');
    form.getTextField('ewewew').setText('PRUEBAAAAAAAAAA ewewew');

    //form.getTextField('undefined_7').setText('PRUEBAAAAAAAAA'); //Tiene celebrado con un Contrato de Interconexión con Comisión Federal de Electricidad,bajo el número 

    // 4. Llenar campos (los nombres deben coincidir con los del PDF)
    form.getTextField('EN').setText(userData.nombre);
    form.getTextField('undefined').setText(userData.tipo_doc + ' ' + userData.ine);
    form.getTextField('Tensión celebrado con Comisión Federal de').setText(userData.tension);
    form.getTextField('undefined_2').setText(userData.rpu);
    form.getTextField('undefined_3').setText(userData.rmu);
    form.getTextField('undefined_4').setText(userData.n_cuenta);
    form.getTextField('undefined_5').setText(userData.domicilio);
    form.getTextField('undefined_6').setText(userData.capacidad);
    form.getTextField('con una tecnología de generación Fotovoltaica').setText(userData.tension_interconexion);
    // form.getTextField('undefined_10').setText(userData.tecnologia); // va bien 
    form.getTextField('undefined_8').setText(userData.domicilio);
    form.getTextField('undefined_9').setText(userData.telefono);
    form.getTextField('undefined_10').setText(userData.correo);
    form.getTextField('undefined_11').setText(userData.tipo_doc + ' ' + userData.ine); // se identifica con 
    form.getTextField('mismo').setText(userData.nombre);
    form.getTextField('Tensión celebrado con Comisión Federal de Electricidad con RPU número').setText(userData.tension);
    form.getTextField('RMU número').setText(userData.rpu); //rpu
    form.getTextField('con').setText(userData.rmu); //rmu
    form.getTextField('que se presta en el domicilio').setText(userData.n_cuenta);
    form.getTextField('undefined_12').setText(userData.domicilio); //domicilio
    form.getTextField('undefined_13').setText(userData.capacidad); //domicilio
    // form.getTextField('undefined_18').setText(userData.tension_interconexion);
    // form.getTextField('undefined_19').setText(userData.tecnologia);
    form.getTextField('undefined_15').setText(userData.domicilio);
    form.getTextField('y correo electrónico').setText(userData.telefono);
    // form.getTextField('telelel').setText(userData.telefono);
    form.getTextField('undefined_16').setText(userData.correo);
    form.getTextField('undefined_17').setText(userData.tipo_doc + ' ' + userData.ine); //se identifica con
    form.getTextField('una tensión voltaje de').setText(userData.capacidad);
    form.getTextField('con una tecnología de generación Fotovoltaica_3').setText(userData.tension_interconexion);
    // form.getTextField('undefined_25').setText(userData.tecnologia);
    form.getTextField('undefined_19').setText(userData.domicilio);
    form.getTextField('y correo electrónico_2').setText(userData.telefono);
    form.getTextField('undefined_20').setText(userData.correo);
    // form.getTextField('en').setText(userData.regimen_contraprestacion);
    form.getTextField('a los').setText(userData.ciudad);
    form.getTextField('días').setText(userData.dias_contra);
    form.getTextField('del año').setText(userData.mes_contra);
    form.getTextField('ewewew').setText(userData.year_contra);
    form.getTextField('1').setText(userData.nombre);
    form.getTextField('undefined_23').setText(userData.nombre);
    form.getTextField('de').setText(userData.dias_contra);
    form.getTextField('nvnvbnb').setText(userData.mes_contra);
    form.getTextField('undefined_21').setText(userData.year_contra);

    // 5. Guardar PDF generado
    const pdfBytes = await pdfDoc.save();

    // 6. Crear blob para abrir/descargar
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Descargar
    const a = document.createElement('a');
    a.href = url;

    //descargar
    // a.download = 'contrato-llenado.pdf';
    // a.click();

    // O mostrar en el navegador
    window.open(url);
  }

  async llenarInterconexion(userData: any) {
    // 1. Cargar PDF desde assets
    //const existingPdfBytes = await fetch('/assets/documentos/ContratoDeInterconexion.pdf').then(res => res.arrayBuffer());
    const existingPdfBytes = await fetch('/assets/documentos/Interconexion2.pdf').then(res => res.arrayBuffer());

    // 2. Cargar documento
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // 3. Obtener formulario
    const form = pdfDoc.getForm();

    // 4. Centrar todos los campos del PDF (justificación)
    const fields = form.getFields();
    fields.forEach(field => {
      try {
        const acroField: any = (field as any).acroField;
        if (acroField && acroField.dict) {
          // 0 = izquierda, 1 = centrado, 2 = derecha
          acroField.dict.set(PDFName.of('Q'), pdfDoc.context.obj(1));
        }
      } catch (err) {
        console.warn('⚠️ No se pudo centrar el campo:', field.getName());
      }
    });


    // 4. Llenar campos (los nombres deben coincidir con los del PDF)
    //form.getTextField('se adquiere el suministro de energía eléctrica para su consumo en').setText(userData.opcionsino);


    form.getTextField('Nombrecompl').setText(userData.nombre);
    form.getTextField('undefined_2').setText(userData.tipo_doc + ' ' + userData.ine);
    // form.getTextField('se adquiere el suministro de energía eléctrica para su consumo en').setText('SI');

    form.getTextField('una tensión voltaje de interconexión V').setText(userData.capacidad);

    //form.getTextField('NomDos').setText('PRUEBAAAAAAAAAAAAA');


    form.getTextField('instalaciones correspondientes la Contrato Mercantil de Suministro de Energía Eléctrica en').setText(userData.tecnologia);
    form.getTextField('con una').setText(userData.tension_interconexion);
    form.getTextField('Nomuno').setText(userData.nombre);
    form.getTextField('RMU número').setText(userData.rpu);
    form.getTextField('con_2').setText(userData.rmu);
    form.getTextField('que se presta en el domicilio ubicado en').setText(userData.n_cuenta);
    form.getTextField('undefined_3').setText(userData.domicilio);
    form.getTextField('undefined_4').setText(userData.tarifa);
    form.getTextField('numero de fases').setText(userData.voltaje);
    form.getTextField('numero de hilos').setText(userData.n_fases);
    form.getTextField('numero de medidor').setText(userData.n_hilos);
    form.getTextField('tipo de medidor electromecánico digital').setText(userData.n_medidor);
    form.getTextField('tensión voltaje de').setText(userData.tipo_medidor);
    form.getTextField('con carga total instalada KVA').setText(userData.tension_interconexion);
    form.getTextField('potencia').setText(String(userData.carga_total));
    form.getTextField('TensionInst').setText(userData.potencia);
    form.getTextField('undefined_5').setText(userData.potencia);
    form.getTextField('ClasificacionCentralEl').setText(userData.central_electrica);
    form.getTextField('CapaciInst').setText(userData.capacidad);
    form.getTextField('con una_2').setText(userData.tension_interconexion);
    // form.getTextField('undefined_11').setText(userData.tecnologia);
    // form.getTextField('undefined_12').setText(userData.regimen_contraprestacion);
    form.getTextField('undefined_6').setText(userData.domicilio);
    form.getTextField('y correo electrónico').setText(userData.telefono);
    form.getTextField('undefined_7').setText(userData.correo);
    // form.getTextField('de_6').setText(userData.mes_inter);
    form.getTextField('EnLaCiudad').setText(userData.ciudad);
    form.getTextField('y consta de 4 fojas incluida ésta').setText(userData.dias_inter);
    form.getTextField('MesDe').setText(userData.mes_inter);
    form.getTextField('Anio').setText(userData.year_inter);
    // form.getTextField('y consta de 5 fojas incluida ésta').setText(userData.year_inter);
    form.getTextField('NombreCelebrado').setText(userData.nombre);
    form.getTextField('DiaFin').setText(userData.dias_inter);
    form.getTextField('MesFin').setText(userData.mes_inter);
    form.getTextField('AnioFin').setText(userData.year_inter);
    form.getTextField('con').setText(userData.nombre);
    // form.getTextField('el').setText(userData.dias_inter);

    // 5. Guardar PDF generado
    const pdfBytes = await pdfDoc.save();

    // 6. Crear blob para abrir/descargar
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Descargar
    const a = document.createElement('a');
    a.href = url;

    //descargar
    // a.download = 'contrato-llenado.pdf';
    // a.click();

    // O mostrar en el navegador
    window.open(url);
  }

  async llenarAnexo(userData: any, datosContacto: any) {
    // 1. Cargar PDF desde assets
    //const existingPdfBytes = await fetch('/assets/documentos/Anexo.pdf').then(res => res.arrayBuffer());
    const existingPdfBytes = await fetch('/assets/documentos/Anexo2.pdf').then(res => res.arrayBuffer());

    // 2. Cargar documento
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // 3. Obtener formulario
    const form = pdfDoc.getForm();
    const excepciones = ["Texto1", "Texto2", "Texto26", "Texto27", "Texto28", "Texto29", "Texto30", "Texto31"];
    // 4. Centrar todos los campos del PDF (justificación)
    const fields = form.getFields();
    fields.forEach(field => {
      const nombre = field.getName();

      // 👉 Si el campo está en la lista de excepciones, no lo centramos
      if (excepciones.includes(nombre)) {
        return;
      }

      try {
        const acroField: any = (field as any).acroField;
        if (acroField && acroField.dict) {
          // 0 = izquierda, 1 = centrado, 2 = derecha
          acroField.dict.set(PDFName.of('Q'), pdfDoc.context.obj(1));
        }
      } catch (err) {
        console.warn('⚠️ No se pudo centrar el campo:', field.getName());
      }
    });


    // 4. Llenar campos (los nombres deben coincidir con los del PDF)
    //     if (userData.aceptaTerminos) {
    //   form.getCheckBox('Casilla de verificación5').check();  // ✅ marcar
    // } else {
    //   form.getCheckBox('Casilla de verificación5').uncheck(); // ⬜ desmarcar
    // }
    const fecha = userData.fecha; // '2025-10-28'
    const [anio, mes, dia] = fecha.split('-');
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    form.getTextField('Texto1').setText(fechaFormateada);
    form.getTextField('Texto2').setText(userData.n_solicitud);

    form.getTextField('Texto3').setText(userData.nombre);
    form.getTextField('Texto4').setText(userData.calle);
    form.getTextField('Texto5').setText(userData.n_exterior);
    form.getTextField('Texto6').setText(userData.n_interior);
    form.getTextField('Texto7').setText(userData.cp);
    form.getTextField('Texto8').setText(userData.colonia);
    form.getTextField('Texto9').setText(userData.municipio);
    form.getTextField('Texto10').setText(userData.estado);
    form.getTextField('Texto11').setText(userData.telefono);
    form.getTextField('Texto12').setText(userData.correo);

    form.getTextField('Texto14').setText(datosContacto.nombre);
    form.getTextField('Texto15').setText(datosContacto.puesto);
    form.getTextField('Texto16').setText(datosContacto.domicilio);
    form.getTextField('Texto17').setText(datosContacto.n_exterior);
    form.getTextField('Texto18').setText(datosContacto.n_interior);
    form.getTextField('Texto19').setText(datosContacto.cp);
    form.getTextField('Texto20').setText(datosContacto.colonia);
    form.getTextField('Texto21').setText(datosContacto.municipio);
    form.getTextField('Texto22').setText(datosContacto.estado);
    form.getTextField('Texto23').setText(datosContacto.telefono);
    form.getTextField('Texto24').setText(datosContacto.correo);

    if (userData.baja_tencion) form.getCheckBox('Casilla de verificación1').check();
    if (userData.media_tension) form.getCheckBox('Casilla de verificación2').check();
    if (userData.consumo_centros) form.getCheckBox('Casilla de verificación3').check();
    if (userData.consumo_centros_ventas) form.getCheckBox('Casilla de verificación4').check();
    if (userData.venta_total) form.getCheckBox('Casilla de verificación5').check();
    form.getTextField('Texto32').setText(userData.especificar);

    let promedio_mensual = parseFloat(userData.capacidad) * 152;

    form.getTextField('Texto26').setText(userData.rpu);
    form.getTextField('Texto27').setText(userData.tension_interconexion);

    const fecha2 = userData.fecha_operacion; // '2025-10-28'
    const [anio2, mes2, dia2] = fecha2.split('-');
    const fechaFormateadaOperacion = `${dia2}/${mes2}/${anio2}`;

    form.getTextField('Texto28').setText(fechaFormateadaOperacion);
    form.getTextField('Texto29').setText(userData.capacidad);
    form.getTextField('Texto30').setText(userData.capacidad_incrementar_opcional);
    form.getTextField('Texto31').setText(promedio_mensual.toString());


    if (userData.solar) form.getCheckBox('Casilla de verificación6').check();
    if (userData.eolico) form.getCheckBox('Casilla de verificación7').check();
    if (userData.biomasa) form.getCheckBox('Casilla de verificación8').check();
    if (userData.cogeneracion) form.getCheckBox('Casilla de verificación9').check();
    if (userData.otro) form.getCheckBox('Casilla de verificación10').check();

    form.getTextField('Texto33').setText(userData.n_unidades);

    form.getTextField('Texto34').setText(userData.x);
    form.getTextField('Texto35').setText(userData.y);

    form.getTextField('Texto40').setText(userData.nombre);
    form.getTextField('Texto44').setText(userData.tecnologia);
    form.getTextField('Texto45').setText(userData.tecnologia_secundaria);

    form.getTextField('Texto41').setText(userData.nombre);
    form.getTextField('Texto42').setText(userData.cargo);
    form.getTextField('Texto43').setText(fechaFormateada);

    // 5. Guardar PDF generado
    const pdfBytes = await pdfDoc.save();

    // 6. Crear blob para abrir/descargar
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Descargar
    const a = document.createElement('a');
    a.href = url;

    //descargar
    // a.download = 'contrato-llenado.pdf';
    // a.click();

    // O mostrar en el navegador
    window.open(url);
  }


  async listFields() {
    //const existingPdfBytes = await fetch('/assets/documentos/ContratoDeInterconexion.pdf').then(res => res.arrayBuffer());
    //const existingPdfBytes = await fetch('/assets/documentos/ContratoDeInterconexion.pdf').then(res => res.arrayBuffer());
    //const existingPdfBytes = await fetch('/assets/documentos/ContratoDeContraprestacion.pdf').then(res => res.arrayBuffer());

    //const existingPdfBytes = await fetch('/assets/documentos/Interconexion2.pdf').then(res => res.arrayBuffer());
    //const existingPdfBytes = await fetch('/assets/documentos/Contraprestacion2.pdf').then(res => res.arrayBuffer());
    const existingPdfBytes = await fetch('/assets/documentos/Anexo2.pdf').then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // Obtener todos los campos
    const fields = form.getFields();

    fields.forEach(f => {
      console.log('Campo:', f.getName());
    });
  }

}