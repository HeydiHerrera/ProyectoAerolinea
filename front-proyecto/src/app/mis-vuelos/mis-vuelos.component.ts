import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mis-vuelos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-vuelos.component.html',
  styleUrls: ['./mis-vuelos.component.scss']
})
export class MisVuelosComponent implements OnInit {

  vuelos: any[] = [];
  aeropuertos: any[] = [];
  vueloDetalle: any = null;
  error: string = '';

  filtro = {
    salidaId: null,
    llegadaId: null,
    fecha: ''
  };

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get<any[]>('https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/reporte/aeropuertos').subscribe({
      next: (data) => {
        this.aeropuertos = data;
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar aeropuertos'
    });
  }

  buscar() {
    if (!this.filtro.salidaId || !this.filtro.llegadaId || !this.filtro.fecha) {
      this.error = 'Debe ingresar los campos obligatorios';
      return;
    }
    if (this.filtro.salidaId === this.filtro.llegadaId) {
      this.error = 'No se puede seleccionar el mismo aeropuerto de salida y llegada.';
      return;
    }
    this.error = '';
    this.http.get<any[]>(`https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/compra/vuelos-disponibles?salidaId=${this.filtro.salidaId}&llegadaId=${this.filtro.llegadaId}&fecha=${this.filtro.fecha}`).subscribe({
      next: (data) => {
        this.vuelos = data;
        if (data.length === 0) this.error = 'No se encontraron vuelos según los parámetros ingresados';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error || 'No se encontraron vuelos según los parámetros ingresados';
        this.vuelos = [];
        this.cdr.detectChanges();
      }
    });
  }

  limpiar() {
    this.filtro = { salidaId: null, llegadaId: null, fecha: '' };
    this.vuelos = [];
    this.error = '';
    this.cdr.detectChanges();
  }

  calcularTiempo(salida: string, llegada: string): string {
    const diff = new Date(llegada).getTime() - new Date(salida).getTime();
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${horas}h ${minutos}m`;
  }

  verDetalle(vuelo: any) {
    this.vueloDetalle = vuelo;
    this.cdr.detectChanges();
  }

  seleccionarVuelo(vuelo: any) {
    this.router.navigate(['/compra-boleto'], { state: { vuelo } });
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}