import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReporteService } from '../services/reporte.service';

@Component({
  selector: 'app-consulta-vuelo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta-vuelo.component.html',
  styleUrls: ['./consulta-vuelo.component.scss']
})
export class ConsultaVueloComponent {

  numeroVuelo: string = '';
  vuelo: any = null;
  error: string = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef, private reporteService: ReporteService) {}

  buscar() {
    if (!this.numeroVuelo) {
      this.error = 'Debe ingresar el numero de vuelo';
      return;
    }
    this.error = '';
    this.vuelo = null;
    this.http.get<any>('http://localhost:8080/reporte/consulta-vuelo/' + this.numeroVuelo).subscribe({
      next: (data) => {
        this.vuelo = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.error && typeof err.error === 'string') {
          this.error = err.error;
        } else {
          this.error = 'El numero de vuelo ingresado no se encontro';
        }
        this.vuelo = null;
        this.cdr.detectChanges();
      }
    });
  }

  imprimirPDF() {
    const columnas = ['Campo', 'Valor'];
    const filas = [
      ['Numero de Vuelo', this.vuelo.numeroVuelo],
      ['Modelo Avion', this.vuelo.modelo],
      ['Aerolinea', this.vuelo.aerolinea],
      ['Origen', this.vuelo.origen],
      ['Destino', this.vuelo.destino],
      ['Fecha y Hora Salida', this.vuelo.fechaSalida],
      ['Fecha y Hora Llegada', this.vuelo.fechaLlegada],
      ['Estado', this.vuelo.estado]
    ];
    this.reporteService.generarPDF('Consulta Vuelo ' + this.vuelo.numeroVuelo, columnas, filas);
  }

  exportarExcel() {
    const columnas = ['Campo', 'Valor'];
    const filas = [
      ['Numero de Vuelo', this.vuelo.numeroVuelo],
      ['Modelo Avion', this.vuelo.modelo],
      ['Aerolinea', this.vuelo.aerolinea],
      ['Origen', this.vuelo.origen],
      ['Destino', this.vuelo.destino],
      ['Fecha y Hora Salida', this.vuelo.fechaSalida],
      ['Fecha y Hora Llegada', this.vuelo.fechaLlegada],
      ['Estado', this.vuelo.estado]
    ];
    this.reporteService.generarExcel('Consulta Vuelo', columnas, filas);
  }

  limpiar() {
    this.numeroVuelo = '';
    this.vuelo = null;
    this.error = '';
    this.cdr.detectChanges();
  }

  volver() {
    this.router.navigate(['/login']);
  }
}