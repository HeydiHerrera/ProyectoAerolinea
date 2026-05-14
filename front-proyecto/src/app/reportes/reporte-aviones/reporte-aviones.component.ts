import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-reporte-aviones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-aviones.component.html',
  styleUrls: ['./reporte-aviones.component.scss']
})
export class ReporteAvionesComponent implements OnInit {

  aerolineas: any[] = [];
  aviones: any[] = [];
  aerolineaSeleccionada: any = null;
  error: string = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef, private reporteService: ReporteService) {}

  ngOnInit() {
    this.http.get<any[]>('https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/reporte/aerolineas').subscribe({
      next: (data) => {
        this.aerolineas = [...data];
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar aerolineas'
    });
  }

  buscar() {
    if (!this.aerolineaSeleccionada) {
      this.error = 'Debe seleccionar una aerolinea';
      return;
    }
    this.error = '';
    this.aviones = [];
    this.http.get<any[]>('https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/reporte/aviones/' + this.aerolineaSeleccionada).subscribe({
      next: (data) => {
        this.aviones = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.error && typeof err.error === 'string') {
          this.error = err.error;
        } else {
          this.error = 'La aerolinea consultada no tiene aviones';
        }
        this.aviones = [];
        this.cdr.detectChanges();
      }
    });
  }

  imprimirPDF() {
    const columnas = ['Modelo', 'Marca', 'Año', 'Capacidad', 'Vuelos'];
    const filas = this.aviones.map(a => [a.modelo, a.marca, a.anio, a.capacidad, a.cantidadVuelos]);
    this.reporteService.generarPDF('Reporte de Aviones por Aerolinea', columnas, filas);
  }

  exportarExcel() {
    const columnas = ['Modelo', 'Marca', 'Año', 'Capacidad', 'Vuelos'];
    const filas = this.aviones.map(a => [a.modelo, a.marca, a.anio, a.capacidad, a.cantidadVuelos]);
    this.reporteService.generarExcel('Aviones por Aerolinea', columnas, filas);
  }

  limpiar() {
    this.aerolineaSeleccionada = null;
    this.aviones = [];
    this.error = '';
    this.cdr.detectChanges();
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}
