import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReporteService } from '../services/reporte.service';
import { MapaAsientosComponent } from '../mapa-asientos/mapa-asientos.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-consulta-vuelo',
  standalone: true,
  imports: [CommonModule, FormsModule, MapaAsientosComponent],
  templateUrl: './consulta-vuelo.component.html',
  styleUrls: ['./consulta-vuelo.component.scss']
})
export class ConsultaVueloComponent {

  numeroVuelo: string = '';
  vuelo: any = null;
  boleto: any = null;
  asientosBoleto: string[] = [];
  mapaListo: boolean = false;
  error: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private reporteService: ReporteService,
    private auth: AuthService
  ) {}

  buscar() {
    if (!this.numeroVuelo) {
      this.error = 'Debe ingresar el numero de vuelo';
      return;
    }
    this.error = '';
    this.vuelo = null;
    this.boleto = null;
    this.asientosBoleto = [];
    this.mapaListo = false;

    this.http.get<any>('https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/reporte/consulta-vuelo/' + this.numeroVuelo).subscribe({
      next: (data) => {
        this.vuelo = data;
        this.cargarMiBoleto();
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

  cargarMiBoleto() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.mapaListo = true;
      this.cdr.detectChanges();
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const username = payload.sub;

    this.http.get<any>('https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/reporte/mi-boleto/' + this.numeroVuelo + '/' + username).subscribe({
      next: (data) => {
        this.boleto = data;
        this.asientosBoleto = [data.asiento];
        this.mapaListo = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.asientosBoleto = [];
        this.mapaListo = true;
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
    this.boleto = null;
    this.asientosBoleto = [];
    this.mapaListo = false;
    this.error = '';
    this.cdr.detectChanges();
  }

volver() {
    const token = localStorage.getItem('token');
    console.log('Token en volver:', token);
    if (token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
}
}
