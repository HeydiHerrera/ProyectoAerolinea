import { Component, OnInit, OnChanges, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mapa-asientos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-asientos.component.html',
  styleUrls: ['./mapa-asientos.component.scss']
})
export class MapaAsientosComponent implements OnInit, OnChanges {

  @Input() numeroVuelo: string = '';
  @Input() asientosBoleto: string[] = [];

  asientos: any[] = [];
  ejecutiva: any[][] = [];
  economica: any[][] = [];
  error: string = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.numeroVuelo) {
      this.cargarAsientos();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['asientosBoleto']) {
      this.cdr.detectChanges();
    }
    if (changes['numeroVuelo'] && this.numeroVuelo) {
      this.cargarAsientos();
    }
  }

  cargarAsientos() {
    this.http.get<any[]>('https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/reporte/asientos/' + this.numeroVuelo).subscribe({
      next: (data) => {
        this.asientos = data;
        this.organizarAsientos();
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar asientos'
    });
  }

  organizarAsientos() {
    const exec = this.asientos.filter(a => a.clase === 'EJECUTIVA');
    const econ = this.asientos.filter(a => a.clase === 'ECONOMICA');
    this.ejecutiva = this.agruparPorFila(exec);
    this.economica = this.agruparPorFila(econ);
  }

  agruparPorFila(asientos: any[]): any[][] {
    const filas: any = {};
    for (const a of asientos) {
      const fila = a.numero.replace(/[A-Z]/g, '');
      if (!filas[fila]) filas[fila] = [];
      filas[fila].push(a);
    }
    return Object.values(filas).map((fila: any) =>
      fila.sort((a: any, b: any) => a.numero.localeCompare(b.numero))
    );
  }

  getIzquierda(fila: any[]): any[] {
    const mitad = Math.ceil(fila.length / 2);
    return fila.slice(0, mitad);
  }

  getDerecha(fila: any[]): any[] {
    const mitad = Math.ceil(fila.length / 2);
    return fila.slice(mitad);
  }

  getColor(asiento: any): string {
    if (this.asientosBoleto.includes(asiento.numero)) return 'boleto';
    if (asiento.estado === 'OCUPADO') return 'ocupado';
    if (asiento.clase === 'EJECUTIVA') return 'ejecutiva';
    return 'economica';
  }
}
