import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-reporte-vuelos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-vuelos.component.html',
  styleUrls: ['./reporte-vuelos.component.scss']
})
export class ReporteVuelosComponent {

  fechaDesde: string = '';
  horaDesde: string = '';
  fechaHasta: string = '';
  horaHasta: string = '';
  vuelos: any[] = [];
  error: string = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef, private reporteService: ReporteService) {}

  buscar() {
    if (!this.fechaDesde || !this.horaDesde || !this.fechaHasta || !this.horaHasta) {
      this.error = 'Debe ingresar todos los campos de fecha y hora';
      return;
    }
    this.error = '';
    this.vuelos = [];
    const params = 'fechaDesde=' + this.fechaDesde + '&horaDesde=' + this.horaDesde +
                   '&fechaHasta=' + this.fechaHasta + '&horaHasta=' + this.horaHasta;
    this.http.get<any[]>('http://localhost:8080/reporte/vuelos-por-fecha?' + params).subscribe({
      next: (data) => {
        this.vuelos = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.error && typeof err.error === 'string') {
          this.error = err.error;
        } else {
          this.error = 'No se encontraron vuelos en ese rango de fechas';
        }
        this.vuelos = [];
        this.cdr.detectChanges();
      }
    });
  }

  imprimirPDF() {
    const columnas = ['Vuelo', 'Modelo', 'Aerolinea', 'Origen', 'Destino', 'Salida', 'Llegada'];
    const filas = this.vuelos.map(v => [v.numeroVuelo, v.modelo, v.aerolinea, v.origen, v.destino, v.fechaSalida, v.fechaLlegada]);
    this.reporteService.generarPDF('Vuelos por Fecha y Hora', columnas, filas);
  }

  exportarExcel() {
    const columnas = ['Vuelo', 'Modelo', 'Aerolinea', 'Origen', 'Destino', 'Salida', 'Llegada'];
    const filas = this.vuelos.map(v => [v.numeroVuelo, v.modelo, v.aerolinea, v.origen, v.destino, v.fechaSalida, v.fechaLlegada]);
    this.reporteService.generarExcel('Vuelos por Fecha', columnas, filas);
  }

  limpiar() {
    this.fechaDesde = '';
    this.horaDesde = '';
    this.fechaHasta = '';
    this.horaHasta = '';
    this.vuelos = [];
    this.error = '';
    this.cdr.detectChanges();
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}