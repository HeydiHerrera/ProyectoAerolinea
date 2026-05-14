import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tripulacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tripulacion.component.html',
  styleUrls: ['./tripulacion.component.scss']
})
export class TripulacionComponent implements OnInit {

  pilotos: any[] = [];
  copilotos: any[] = [];
  ingenieros: any[] = [];
  cabina: any[] = [];

  seleccion = {
    piloto: null,
    copiloto: null,
    ingeniero: null,
    cabina1: null,
    cabina2: null,
    cabina3: null
  };

  error: string = '';
  success: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any>('https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/tripulacion/personal').subscribe({
      next: (data) => {
        this.pilotos = data.pilotos;
        this.copilotos = data.copilotos;
        this.ingenieros = data.ingenieros;
        this.cabina = data.cabina;
      },
      error: () => {
        this.error = 'Error al cargar el personal';
      }
    });
  }

  guardar() {
    if (!this.seleccion.piloto || !this.seleccion.copiloto ||
        !this.seleccion.ingeniero || !this.seleccion.cabina1 ||
        !this.seleccion.cabina2 || !this.seleccion.cabina3) {
      this.error = 'Debe ingresar los campos obligatorios';
      return;
    }

    const body = {
      piloto: { id: this.seleccion.piloto },
      copiloto: { id: this.seleccion.copiloto },
      ingeniero: { id: this.seleccion.ingeniero },
      cabina1: { id: this.seleccion.cabina1 },
      cabina2: { id: this.seleccion.cabina2 },
      cabina3: { id: this.seleccion.cabina3 }
    };

    this.http.post('https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/tripulacion/guardar', body, { responseType: 'text' }).subscribe({
      next: () => {
        this.success = 'Se creo con exito la tripulacion';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error || 'Error al guardar la tripulacion';
      }
    });
  }
}
