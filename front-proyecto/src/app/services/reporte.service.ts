import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  generarPDF(titulo: string, columnas: string[], filas: any[][]) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(26, 58, 92);
    doc.text('AEROLINEA LOS PRIMOS', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(titulo, 105, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Fecha: ' + new Date().toLocaleDateString(), 14, 35);
    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      headStyles: { fillColor: [26, 58, 92] },
      alternateRowStyles: { fillColor: [240, 244, 248] }
    });
    doc.save(titulo + '.pdf');
  }

  generarExcel(titulo: string, columnas: string[], filas: any[][]) {
    const nombreHoja = titulo.substring(0, 31);
    const data = [columnas, ...filas];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, nombreHoja);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, titulo + '.xlsx');
  }
}
