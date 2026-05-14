import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-reporte-equipaje',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-equipaje.component.html',
  styleUrls: ['./reporte-equipaje.component.scss']
})
export class ReporteEquipajeComponent {

  numeroVuelo: string = '';
  equipaje: any[] = [];
  error: string = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef, private reporteService: ReporteService) {}

  buscar() {
    if (!this.numeroVuelo) {
      this.error = 'Debe ingresar el numero de vuelo';
      return;
    }
    this.error = '';
    this.equipaje = [];
    this.http.get<any[]>('https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/reporte/equipaje/' + this.numeroVuelo).subscribe({
      next: (data) => {
        this.equipaje = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error || 'El numero de vuelo ingresado no existe.';
        this.equipaje = [];
        this.cdr.detectChanges();
      }
    });
  }

  imprimirPDF() {
    const columnas = ['Nombre Pasajero', 'Cantidad Maletas', 'Recargo'];
    const filas = this.equipaje.map(e => [e.nombre, e.maletas, e.recargo]);
    this.reporteService.generarPDF('Equipaje por Vuelo ' + this.numeroVuelo, columnas, filas);
  }

  exportarExcel() {
    const columnas = ['Nombre Pasajero', 'Cantidad Maletas', 'Recargo'];
    const filas = this.equipaje.map(e => [e.nombre, e.maletas, e.recargo]);
    this.reporteService.generarExcel('Equipaje Vuelo ' + this.numeroVuelo, columnas, filas);
  }

  limpiar() {
    this.numeroVuelo = '';
    this.equipaje = [];
    this.error = '';
    this.cdr.detectChanges();
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}
