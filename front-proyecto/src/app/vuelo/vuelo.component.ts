import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vuelo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vuelo.component.html',
  styleUrls: ['./vuelo.component.scss']
})
export class VueloComponent implements OnInit {

  aeropuertos: any[] = [];
  aviones: any[] = [];
  tripulaciones: any[] = [];

  paso: number = 1;
  error: string = '';
  success: string = '';

  vuelo = {
    numeroVuelo: '',
    aeropuertoSalida: { id: null },
    aeropuertoLlegada: { id: null },
    fechaHoraSalida: '',
    fechaHoraLlegada: '',
    avion: { id: null },
    tripulacion: { id: null },
    precioEconomica: null,
    precioEjecutiva: null
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:8080/vuelo/datos').subscribe({
      next: (data) => {
        this.aeropuertos = data.aeropuertos;
        this.aviones = data.aviones;
        this.tripulaciones = data.tripulaciones;
      },
      error: () => this.error = 'Error al cargar los datos'
    });
  }

  siguiente() {
    if (!this.vuelo.numeroVuelo || !this.vuelo.aeropuertoSalida.id ||
        !this.vuelo.aeropuertoLlegada.id || !this.vuelo.fechaHoraSalida ||
        !this.vuelo.fechaHoraLlegada) {
      this.error = 'Debe ingresar los campos obligatorios';
      return;
    }
    if (this.vuelo.aeropuertoSalida.id === this.vuelo.aeropuertoLlegada.id) {
      this.error = 'No se puede seleccionar el mismo aeropuerto de salida y llegada.';
      return;
    }
    const salida = new Date(this.vuelo.fechaHoraSalida);
    const llegada = new Date(this.vuelo.fechaHoraLlegada);
    const ahora = new Date();
    const cincoHoras = new Date(ahora.getTime() + 5 * 60 * 60 * 1000);
    if (salida < cincoHoras) {
      this.error = 'Tiempo minimo para la preparacion 5 horas a partir de la hora actual.';
      return;
    }
    if (llegada <= salida) {
      this.error = 'La fecha y hora de llegada debe ser mayor a la fecha y hora de salida.';
      return;
    }
    this.error = '';
    this.paso = 2;
  }

  guardar() {
    if (!this.vuelo.avion.id || !this.vuelo.tripulacion.id ||
        !this.vuelo.precioEconomica || !this.vuelo.precioEjecutiva) {
      this.error = 'Debe ingresar los campos obligatorios';
      return;
    }
    this.error = '';
    this.http.post('http://localhost:8080/vuelo/guardar', this.vuelo, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.success = 'Se creo con exito el vuelo';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error || 'Error al guardar el vuelo';
      }
    });
  }

  cancelar() {
    this.router.navigate(['/dashboard']);
  }
}