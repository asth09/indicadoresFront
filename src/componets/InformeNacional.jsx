import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generarInformeNacionalPDF = (data) => {
    const hoy = new Date();

    // 1. Procesamos las regiones para calcular los vencidos en tiempo real
    const regionesProcesadas = data.regions?.map(r => {
        // Si data.regions contiene los objetos de las ciudades con sus delegados:
        const vencidosCalculados = r.ciudadesDetalle?.reduce((acc, ciudad) => {
            const numVencidos = ciudad.delegados?.filter(d => new Date(d.vencimiento) < hoy).length || 0;
            return acc + numVencidos;
        }, 0) || r.delegadosVencidos || 0; // Backup por si ya venía el número o viene undefined

        return { ...r, delegadosVencidos: vencidosCalculados };
    }) || [];

    // 2. Recalcular el total nacional para el KPI superior
    const totalNacionalVencidos = regionesProcesadas.reduce((acc, r) => acc + r.delegadosVencidos, 0);

    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'letter'
    });

    const DASHBOARD_YEAR = "2026";
    const logo = "/img/logo.PNG"; // Ruta de tu logo local

    // --- PÁGINA 1: RESUMEN EJECUTIVO ---

    // Encabezado Estivo Corporativo
    doc.addImage(logo, 'PNG', 15, 10, 22, 22);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(164, 71, 29); // Color #a4471d
    doc.text("GERENCIA DE HIGIENE Y SEGURIDAD INDUSTRIAL", 42, 15);
    
    doc.setFontSize(14);
    doc.setTextColor(184, 20, 27); // Color #b8141b (Rojo Regional)
    doc.text("Informe resumen de gestión de Seguridad y Salud", 42, 22);
    doc.text("en el Trabajo en CEDIS - Nacional", 42, 28);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(139, 111, 96); // Color #8b6f60
    doc.text(`Corte nacional ${DASHBOARD_YEAR}. Consolidado de cumplimiento documental y alertas.`, 42, 34);

    // Bloque derecho (Organización)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("C.A. CERVECERÍA REGIONAL", 200, 15, { align: "right" });
    doc.setFontSize(9);
    doc.text("DIRECCIÓN DE SEGURIDAD", 200, 20, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text(`Actualizado al: ${data.meta.updatedAt}`, 200, 25, { align: "right" });

    // Tarjetas de Metadatos (Meses y Accidentes)
    autoTable(doc, {
        startY: 45,
        head: [['Mes de emisión', 'Mes cumplido', 'Accidentes acumulados']],
        body: [[data.meta.emissionMonth, data.meta.fulfilledMonth, data.accidentesTotales]],
        theme: 'grid',
        headStyles: { fillColor: [255, 248, 241], textColor: [92, 67, 54], fontStyle: 'bold' },
        styles: { halign: 'center' }
    });

    // KPIs Principales
    const kpiData = [
        ['CEDIS', data.totalCedis],
        ['Críticos', data.criticos],
        ['Seguimiento', data.seguimiento],
        ['Controlados', data.controlados],
        ['Del. Vencidos', totalNacionalVencidos],
        ['Comités Desact.', data.comitesDesactualizados],
        ['Prog. Desact.', data.programasDesactualizados],
        ['Formación Prom.', `${data.formacionPromedio}%`]
    ];

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 5,
        body: [
            kpiData.map(k => k[0]),
            kpiData.map(k => k[1])
        ],
        theme: 'plain',
        styles: { fontSize: 8, halign: 'center', cellPadding: 2, lineWidth: 0.1, lineColor: [234, 215, 200] },
        bodyStyles: { fontStyle: 'bold', fontSize: 10 }
    });

    // Tabla: Estado por Región
    doc.setFontSize(11);
    doc.text("Estado por Región", 15, doc.lastAutoTable.finalY + 10);
    
    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 12,
        head: [['Región', 'CEDIS', 'Críticos', 'Seguimiento', 'Controlados', 'Formación', 'Accidentes']],
        // CORRECCIÓN: Se cambió 'data.regions' por 'regionesProcesadas'
        body: regionesProcesadas.map(r => [
            r.region, r.cedis, r.criticos, r.seguimiento, r.controlados, `${r.formacion}%`, r.accidentes
        ]),
        headStyles: { fillColor: [255, 248, 241], textColor: [92, 67, 54] },
        columnStyles: {
            2: { fontStyle: 'bold' },
            5: { fontStyle: 'bold' }
        }
    });

    // Tabla: Alertas Críticas
    doc.setFontSize(11);
    doc.text("Alertas Prioritarias", 15, doc.lastAutoTable.finalY + 10);

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 12,
        head: [['CEDIS', 'Región', 'Nivel', 'Detalle']],
        body: data.urgentAlerts.length ? data.urgentAlerts.map(item => [
            item.cedis, item.region, item.level === 'high' ? 'CRÍTICO' : 'ALTA', item.reasons.join(' · ')
        ]) : [['-', '-', '-', 'Sin alertas críticas registradas.']],
        headStyles: { fillColor: [184, 20, 27] },
        columnStyles: { 3: { cellWidth: 80 } }
    });

    // --- PÁGINA 2: CONSOLIDADO Y ANÁLISIS ---
    doc.addPage();

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Consolidado Detallado por Región", 15, 20);

    autoTable(doc, {
        startY: 25,
        head: [['Región', 'CEDIS', 'Crit.', 'Del. Ven.', 'Comit.', 'Prog.', 'Pol.', 'Form.', 'Acc.']],
        // CORRECCIÓN: Se cambió 'data.regions' por 'regionesProcesadas' para reflejar el valor calculado
        body: regionesProcesadas.map(r => [
            r.region, r.cedis, r.criticos, r.delegadosVencidos, r.comitesDesactualizados, 
            r.programasDesactualizados, r.politicasPendientes, `${r.formacion}%`, r.accidentes
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [31, 41, 55] }
    });

    // Acciones Sugeridas
    doc.setFontSize(11);
    doc.text("Acciones sugeridas por Región", 15, doc.lastAutoTable.finalY + 10);

    // CORRECCIÓN: Se cambió 'data.regions' por 'regionesProcesadas'
    const closingRows = regionesProcesadas.map(r => {
        const focus = [];
        if (r.delegadosVencidos > 0) focus.push('Regularizar delegados');
        if (r.comitesDesactualizados > 0) focus.push('Actualizar comité');
        if (r.programasDesactualizados > 0) focus.push('Actualizar programa');
        if (r.politicasPendientes > 0) focus.push('Cerrar política SST');
        if (r.formacion < 100) focus.push('Completar formación');
        if (r.accidentes > 0) focus.push('Revisar accidentabilidad');
        return [r.region, focus.length ? focus.join(' · ') : 'Sostener condición actual'];
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 12,
        head: [['Región', 'Acción sugerida']],
        body: closingRows,
        columnStyles: { 1: { cellWidth: 140 } }
    });

    // Análisis General (Caja de texto final)
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFillColor(255, 248, 241);
    doc.rect(15, finalY, 185, 40, 'F');
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Análisis General:", 20, finalY + 8);
    
    doc.setFont("helvetica", "normal");
    const analysisText = data.analysis || ["No se dispone de análisis para este periodo."];
    doc.text(analysisText.join(' '), 20, finalY + 15, { maxWidth: 175, align: 'justify' });

    doc.save(`Informe_Nacional_SST_${DASHBOARD_YEAR}.pdf`);
};

export default generarInformeNacionalPDF;