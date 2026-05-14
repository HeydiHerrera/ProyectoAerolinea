import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.scss']
})
export class BitacoraComponent implements OnInit {

  registros: any[] = [];
  filtrados: any[] = [];
  busqueda: string = '';
  filtroAccion: string = '';
  acciones: string[] = [];
  error: string = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get<any[]>('https://aerolinea-backend-geh3hdg9abfxcnfw.centralus-01.azurewebsites.net/bitacora/todo').subscribe({
      next: (data) => {
        this.registros = data;
        this.filtrados = data;
        this.acciones = [...new Set(data.map((r: any) => r.accion))];
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar la bitacora';
        this.cdr.detectChanges();
      }
    });
  }

  filtrar() {
    this.filtrados = this.registros.filter(r => {
      const coincideBusqueda = !this.busqueda ||
        r.usuario.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        r.detalle.toLowerCase().includes(this.busqueda.toLowerCase());
      const coincideAccion = !this.filtroAccion || r.accion === this.filtroAccion;
      return coincideBusqueda && coincideAccion;
    });
    this.cdr.detectChanges();
  }

  getIcono(accion: string): string {
    const iconos: any = {
      'LOGIN': '🔐',
      'LOGIN_FALLIDO': '⛔',
      'REGISTRO': '📝',
      'COMPRA_BOLETO': '🎫',
      'ABORDAJE': '✈️',
      'ABORDAJE_RECARGO': '💰',
      'FINALIZAR_ABORDAJE': '🏁',
      'CREAR_VUELO': '🛫',
      'CREAR_TRIPULACION': '👥'
    };
    return iconos[accion] || '📋';
  }

  getClase(accion: string): string {
    const clases: any = {
      'LOGIN': 'login',
      'LOGIN_FALLIDO': 'error',
      'REGISTRO': 'registro',
      'COMPRA_BOLETO': 'compra',
      'ABORDAJE': 'abordaje',
      'ABORDAJE_RECARGO': 'recargo',
      'FINALIZAR_ABORDAJE': 'finalizar',
      'CREAR_VUELO': 'vuelo',
      'CREAR_TRIPULACION': 'tripulacion'
    };
    return clases[accion] || 'default';
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}