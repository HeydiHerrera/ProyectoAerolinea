import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mis-vuelos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-vuelos.component.html',
  styleUrls: ['./mis-vuelos.component.scss']
})
export class MisVuelosComponent implements OnInit {

  vuelos: any[] = [];
  error: string = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get<any[]>('https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/compra/vuelos-disponibles').subscribe({
      next: (data) => {
        this.vuelos = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error || 'No hay vuelos disponibles';
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarVuelo(vuelo: any) {
    this.router.navigate(['/compra-boleto'], { state: { vuelo } });
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}
