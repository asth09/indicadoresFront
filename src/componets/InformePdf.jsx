import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getRegionalReportRequest } from "../api/cedis"; 

/**
 * Genera el informe PDF regional de Gestión SST con estilo corporativo Regional.
 * @param {string} regionId - ID para la consulta a la API.
 * @param {string} regionNombre - Nombre legible para el título.
 */
export const generarInformePDF = async (regionId, regionNombre) => {
    // Validación preventiva
    if (!regionId || regionId === "undefined") {
        console.error("Error: regionId no definido");
        alert("No se puede generar el informe: Región no identificada.");
        return;
    }

    try {
        // 1. Obtención de datos desde la API
        const response = await getRegionalReportRequest(regionId);
        const data = response.data;
        const ciudades = Array.isArray(data) ? data : (data.ciudades || []);

        if (ciudades.length === 0) {
            alert(`No se encontraron registros de CEDIS para: ${regionNombre}`);
            return;
        }

        const doc = new jsPDF();
        const fechaActual = "28/04/2026"; 
        const logoUrl = "/img/logo.PNG";

        // 2. ENCABEZADO ESTILO CORPORATIVO
        try { 
            doc.addImage(logoUrl, 'PNG', 15, 10, 30, 25); 
        } catch (e) {
            console.warn("Logo no encontrado");
        }

        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text("C.A. CERVECERÍA REGIONAL", 200, 15, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.text("DIRECCIÓN DE SEGURIDAD", 200, 20, { align: "right" });
        doc.text("GERENCIA DE HIGIENE Y SEGURIDAD INDUSTRIAL", 200, 25, { align: "right" });

        // Títulos Principales
        doc.setFontSize(16).setTextColor(180, 0, 0); // Rojo Regional
        doc.text("Informe regional del estado de la gestión SST 2026", 105, 45, { align: "center" });
        
        doc.setFontSize(14).setTextColor(0, 0, 0);
        doc.text(regionNombre.toUpperCase(), 105, 52, { align: "center" });
        
        doc.setFontSize(9);
        doc.text(`Actualizado al: ${fechaActual}`, 105, 58, { align: "center" });
        doc.text("Mes cumplido: Marzo 2026", 105, 63, { align: "center" });

        // 3. TABLA DE INDICADORES GLOBALES (RESUMEN)
        // Calculamos totales desde la data de la API
        const totalTrabajadores = ciudades.reduce((acc, c) => acc + (Number(c.trabajadores) || 0), 0);
        const hoy = new Date();
        const totalVencidos = ciudades.reduce((acc, c) => {
        // Contamos cuántos delegados de esta ciudad ya vencieron
        const vencidosEnCiudad = c.delegados?.filter(d => new Date(d.vencimiento) < hoy).length || 0;
        return acc + vencidosEnCiudad;
        }, 0);
        const totalAccidentes = ciudades.reduce((acc, c) => acc + (Number(c.accidentes) || 0), 0);

        autoTable(doc, {
            startY: 70,
            head: [["CEDIS", "N° Trabajadores", "Del. Vencidos", "Comités Desact.", "Prog. Desact.", "Accidentes"]],
            body: [[
                ciudades.length, 
                totalTrabajadores, 
                totalVencidos,
                ciudades.filter(c => !c.comiteActualizado).length,
                ciudades.filter(c => !c.programaActualizado).length,
                totalAccidentes
            ]],
            theme: 'grid',
            styles: { halign: 'center', fontSize: 10 },
            headStyles: { fillColor: [150, 0, 0], textColor: [255, 255, 255] }
        });

        // 4. MATRIZ DETALLADA POR CEDIS
        const bodyGestion = ciudades.map(ciudad => [
            ciudad.cedis,
            ciudad.trabajadores || 0,
            ciudad.delegados?.filter(d => new Date(d.vencimiento) < new Date()).length || 0,
            ciudad.comiteActualizado ? "Sí" : "No",
            ciudad.programaActualizado ? "Sí" : "No",
            ciudad.estadoPolitica || "Pendiente",
            `${ciudad.porcentajeFormacion || 0}%`,
            ciudad.accidentes || 0,
            ciudad.observaciones || "Sin observaciones legales."
        ]);

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [['CEDIS', 'Trab.', 'Venc.', '¿Comité?', '¿Prog?', 'Política', '% Form.', 'Acc.', 'Observaciones/detalle']],
            body: bodyGestion,
            styles: { fontSize: 7, cellPadding: 2 },
            headStyles: { fillColor: [50, 50, 50] },
            columnStyles: { 8: { cellWidth: 50 } } 
        });

        // 5. CENSO DE DELEGADOS Y PATRONOS (SEGUNDA PÁGINA)
        doc.addPage();
        doc.setFontSize(12).setFont("helvetica", "bold").setTextColor(0, 0, 0);
        doc.text("Delegados de prevención y representantes del patrono por CEDIS", 105, 20, { align: "center" });

        const bodyPersonal = ciudades.map(ciudad => [
            ciudad.cedis,
            // Formateo de Delegados: Nombre - Vence
            ciudad.delegados?.map(d => `${d.nombre}\nVence: ${d.vencimiento}`).join('\n\n') || "N/A",
            // Representantes del patrono
            ciudad.patronos?.map(p => `${p.nombre}\nCargo: ${p.cargo}`).join('\n\n') || "N/A"
        ]);

        autoTable(doc, {
            startY: 30,
            head: [['CEDIS', 'Delegados de prevención', 'Representantes del patrono']],
            body: bodyPersonal,
            theme: 'striped',
            styles: { fontSize: 8, overflow: 'linebreak', cellPadding: 4 },
            columnStyles: { 
                1: { cellWidth: 75 },
                2: { cellWidth: 75 }
            }
        });


        // Descarga
        doc.save(`Informe_SST_${regionNombre.replace(/\s+/g, '_')}_2026.pdf`);

    } catch (error) {
        console.error("Error crítico:", error);
        alert("Ocurrió un error al procesar los datos del servidor.");
    }
};