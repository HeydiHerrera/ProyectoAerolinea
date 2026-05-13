import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-reporte-pasajeros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-pasajeros.component.html',
  styleUrls: ['./reporte-pasajeros.component.scss']
})
export class ReportePasajerosComponent {

  numeroVuelo: string = '';
  pasajeros: any[] = [];
  error: string = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef, private reporteService: ReporteService) {}

  buscar() {
    if (!this.numeroVuelo) {
      this.error = 'Debe ingresar el numero de vuelo';
      return;
    }
    this.error = '';
    this.pasajeros = [];
    this.http.get<any[]>('http://localhost:8080/reporte/pasajeros/' + this.numeroVuelo).subscribe({
      next: (data) => {
        this.pasajeros = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error || 'El numero de vuelo ingresado no existe.';
        this.pasajeros = [];
        this.cdr.detectChanges();
      }
    });
  }

  imprimirPDF() {
    const columnas = ['Nombre', 'Pasaporte', 'Nacionalidad', 'Telefono', 'Correo'];
    const filas = this.pasajeros.map(p => [p.nombre, p.pasaporte, p.nacionalidad, p.telefono, p.correo]);
    this.reporteService.generarPDF('Pasajeros por Vuelo ' + this.numeroVuelo, columnas, filas);
  }

  exportarExcel() {
    const columnas = ['Nombre', 'Pasaporte', 'Nacionalidad', 'Telefono', 'Correo'];
    const filas = this.pasajeros.map(p => [p.nombre, p.pasaporte, p.nacionalidad, p.telefono, p.correo]);
    this.reporteService.generarExcel('Pasajeros Vuelo ' + this.numeroVuelo, columnas, filas);
  }

  limpiar() {
    this.numeroVuelo = '';
    this.pasajeros = [];
    this.error = '';
    this.cdr.detectChanges();
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}