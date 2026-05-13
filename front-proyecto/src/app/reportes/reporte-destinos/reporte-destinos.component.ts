import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-reporte-destinos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-destinos.component.html',
  styleUrls: ['./reporte-destinos.component.scss']
})
export class ReporteDestinosComponent implements OnInit {

  aerolineas: any[] = [];
  destinos: any[] = [];
  aerolineaSeleccionada: any = null;
  error: string = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef, private reporteService: ReporteService) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/reporte/aerolineas').subscribe({
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
    this.destinos = [];
    this.http.get<any[]>('http://localhost:8080/reporte/destinos/' + this.aerolineaSeleccionada).subscribe({
      next: (data) => {
        this.destinos = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.error && typeof err.error === 'string') {
          this.error = err.error;
        } else {
          this.error = 'La aerolinea consultada no tiene destinos autorizados';
        }
        this.destinos = [];
        this.cdr.detectChanges();
      }
    });
  }

  imprimirPDF() {
    const columnas = ['Aeropuerto', 'Pais', 'Ciudad'];
    const filas = this.destinos.map(d => [d.aeropuerto, d.pais, d.ciudad]);
    this.reporteService.generarPDF('Destinos Autorizados', columnas, filas);
  }

  exportarExcel() {
    const columnas = ['Aeropuerto', 'Pais', 'Ciudad'];
    const filas = this.destinos.map(d => [d.aeropuerto, d.pais, d.ciudad]);
    this.reporteService.generarExcel('Destinos Autorizados', columnas, filas);
  }

  limpiar() {
    this.aerolineaSeleccionada = null;
    this.destinos = [];
    this.error = '';
    this.cdr.detectChanges();
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}