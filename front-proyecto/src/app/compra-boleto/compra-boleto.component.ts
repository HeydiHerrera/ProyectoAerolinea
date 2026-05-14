import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MapaAsientosComponent } from '../mapa-asientos/mapa-asientos.component';

@Component({
  selector: 'app-compra-boleto',
  standalone: true,
  imports: [CommonModule, FormsModule, MapaAsientosComponent],
  templateUrl: './compra-boleto.component.html',
  styleUrls: ['./compra-boleto.component.scss']
})
export class CompraBoletoComponent implements OnInit {

  vuelo: any = null;
  asientos: any[] = [];
  asientoSeleccionado: any = null;
  metodoPago: string = 'TARJETA';
  numeroTarjeta: string = '';
  error: string = '';
  success: string = '';
  paso: number = 1;
  boletoGenerado: any = null;

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.vuelo = nav.extras.state['vuelo'];
    }
  }

  ngOnInit() {
    if (!this.vuelo) {
      this.router.navigate(['/mis-vuelos']);
      return;
    }
    this.cargarAsientos();
  }

  cargarAsientos() {
    this.http.get<any[]>('http://localhost:8080/reporte/asientos/' + this.vuelo.numeroVuelo).subscribe({
      next: (data) => {
        this.asientos = [...data];
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar asientos'
    });
  }

  seleccionarAsiento(asiento: any) {
    if (asiento.estado === 'OCUPADO') return;
    this.asientoSeleccionado = asiento;
    this.error = '';
    this.cdr.detectChanges();
  }

  getPrecio(): number {
    if (!this.asientoSeleccionado) return 0;
    return this.asientoSeleccionado.clase === 'EJECUTIVA'
      ? this.vuelo.precioEjecutiva
      : this.vuelo.precioEconomica;
  }

  siguiente() {
    if (!this.asientoSeleccionado) {
      this.error = 'Debe seleccionar un asiento';
      return;
    }
    this.error = '';
    this.paso = 2;
  }

  confirmarCompra() {
    if (this.metodoPago === 'TARJETA' && this.numeroTarjeta.length < 16) {
      this.error = 'Ingrese un numero de tarjeta valido (16 digitos)';
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'Debe iniciar sesion';
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const pasaporte = payload.sub;

    const body = {
      numeroVuelo: this.vuelo.numeroVuelo,
      pasaporte: pasaporte,
      asientoId: this.asientoSeleccionado.id,
      metodoPago: this.metodoPago
    };

    this.http.post<any>('http://localhost:8080/compra/comprar', body).subscribe({
      next: (data) => {
        this.boletoGenerado = data;
        this.paso = 3;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error || 'Error al procesar la compra';
        this.cdr.detectChanges();
      }
    });
  }

  volver() {
    if (this.paso === 2) {
      this.paso = 1;
    } else {
      this.router.navigate(['/mis-vuelos']);
    }
  }

  irDashboard() {
    this.router.navigate(['/dashboard']);
  }

  getAsientosOcupados(): string[] {
    return this.asientos
      .filter(a => a.estado === 'OCUPADO')
      .map(a => a.numero);
  }

  getAsientosBoleto(): string[] {
    return this.asientoSeleccionado ? [this.asientoSeleccionado.numero] : [];
  }
}