import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-reporte-aerolineas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-aerolineas.component.html',
  styleUrls: ['./reporte-aerolineas.component.scss']
})
export class ReporteAerolineasComponent implements OnInit {

  aeropuertos: any[] = [];
  aerolineas: any[] = [];
  aeropuertoSeleccionado: any = null;
  error: string = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef, private reporteService: ReporteService) {}

  ngOnInit() {
    this.http.get<any[]>('https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/reporte/aeropuertos').subscribe({
      next: (data) => {
        this.aeropuertos = [...data];
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar aeropuertos'
    });
  }

  buscar() {
    if (!this.aeropuertoSeleccionado) {
      this.error = 'Debe seleccionar un aeropuerto';
      return;
    }
    this.error = '';
    this.aerolineas = [];
    this.http.get<any[]>('https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/reporte/aerolineas-por-aeropuerto/' + this.aeropuertoSeleccionado).subscribe({
      next: (data) => {
        this.aerolineas = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.error && typeof err.error === 'string') {
          this.error = err.error;
        } else {
          this.error = 'El aeropuerto consultado no tiene aerolineas';
        }
        this.aerolineas = [];
        this.cdr.detectChanges();
      }
    });
  }

  imprimirPDF() {
    const columnas = ['Aerolinea', 'Cantidad Aviones', 'Destinos'];
    const filas = this.aerolineas.map(a => [a.aerolinea, a.cantidadAviones, a.destinos]);
    this.reporteService.generarPDF('Aerolineas por Aeropuerto', columnas, filas);
  }

  exportarExcel() {
    const columnas = ['Aerolinea', 'Cantidad Aviones', 'Destinos'];
    const filas = this.aerolineas.map(a => [a.aerolinea, a.cantidadAviones, a.destinos]);
    this.reporteService.generarExcel('Aerolineas por Aeropuerto', columnas, filas);
  }

  limpiar() {
    this.aeropuertoSeleccionado = null;
    this.aerolineas = [];
    this.error = '';
    this.cdr.detectChanges();
  }
volver() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
