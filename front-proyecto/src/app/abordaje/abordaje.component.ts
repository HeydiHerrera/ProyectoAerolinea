import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-abordaje',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './abordaje.component.html',
  styleUrls: ['./abordaje.component.scss']
})
export class AbordajeComponent implements OnInit {
  vuelos: any[] = [];
  vueloSeleccionado: any = null;
  pasaporte: string = '';
  maletas: number = 0;
  error: string = '';
  success: string = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarVuelos();
  }

  cargarVuelos() {
    this.http.get<any[]>('http://localhost:8080/abordaje/vuelos').subscribe({
      next: (data) => {
        this.vuelos = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No hay vuelos disponibles';
      }
    });
  }

  seleccionarVuelo(vuelo: any) {
    this.vueloSeleccionado = vuelo;
    this.error = '';
    this.success = '';
    this.pasaporte = '';
    this.maletas = 0;
  }

  abordar() {
    if (!this.pasaporte) {
      this.error = 'Debe ingresar los campos obligatorios';
      return;
    }
    const body = {
      vueloId: this.vueloSeleccionado.id,
      pasaporte: this.pasaporte,
      maletas: this.maletas
    };
    this.http.post('http://localhost:8080/abordaje/abordar', body, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.success = res;
        this.error = '';
        this.pasaporte = '';
        this.maletas = 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error || 'Error al abordar pasajero';
        this.success = '';
      }
    });
  }

  finalizarAbordaje() {
    this.http.post('http://localhost:8080/abordaje/finalizar/' + this.vueloSeleccionado.id, {}, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.success = res;
        this.vueloSeleccionado = null;
        this.cargarVuelos();
      },
      error: () => this.error = 'Error al finalizar abordaje'
    });
  }

  nuevoVuelo() {
    this.vueloSeleccionado = null;
    this.error = '';
    this.success = '';
  }

  irDashboard() {
    this.router.navigate(['/dashboard']);
  }
}