import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-avion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avion.component.html',
  styleUrls: ['./avion.component.scss']
})
export class AvionComponent implements OnInit {

  aerolineas: any[] = [];
  error: string = '';
  success: string = '';

  avion = {
    modelo: '',
    marca: '',
    anio: '',
    capacidad: '',
    estado: 'Activo',
    aerolinea: { id: null }
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/avion/aerolineas').subscribe({
      next: (data) => this.aerolineas = data,
      error: () => this.error = 'Error al cargar aerolineas'
    });
  }

  guardar() {
    if (!this.avion.modelo || !this.avion.marca || !this.avion.anio ||
        !this.avion.capacidad || !this.avion.aerolinea.id) {
      this.error = 'Debe ingresar los campos obligatorios';
      return;
    }
    if (Number(this.avion.capacidad) <= 0) {
      this.error = 'La capacidad debe ser mayor a 0';
      return;
    }
    this.error = '';
    this.http.post('http://localhost:8080/avion/guardar', this.avion, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.success = res;
        setTimeout(() => {
          this.success = '';
          this.limpiar();
        }, 2000);
      },
      error: (err) => {
        this.error = err.error || 'Error al guardar el avion';
      }
    });
  }

  limpiar() {
    this.avion = {
      modelo: '',
      marca: '',
      anio: '',
      capacidad: '',
      estado: 'Activo',
      aerolinea: { id: null }
    };
  }
}