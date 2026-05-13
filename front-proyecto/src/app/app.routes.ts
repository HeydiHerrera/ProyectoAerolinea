import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { TripulacionComponent } from './tripulacion/tripulacion.component';
import { AvionComponent } from './avion/avion.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VueloComponent } from './vuelo/vuelo.component';
import { AbordajeComponent } from './abordaje/abordaje.component';
import { ReporteAvionesComponent } from './reportes/reporte-aviones/reporte-aviones.component';
import { ReportePasajerosComponent } from './reportes/reporte-pasajeros/reporte-pasajeros.component';
import { ReporteEquipajeComponent } from './reportes/reporte-equipaje/reporte-equipaje.component';
import { ReporteDestinosComponent } from './reportes/reporte-destinos/reporte-destinos.component';
import { ReporteAerolineasComponent } from './reportes/reporte-aerolineas/reporte-aerolineas.component';
import { ReporteVuelosComponent } from './reportes/reporte-vuelos/reporte-vuelos.component';
import { ConsultaVueloComponent } from './consulta-vuelo/consulta-vuelo.component';
import { AuthGuard } from './guards/auth.guard';
import { RolGuard } from './guards/rol.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  // Rutas publicas sin login
  { path: 'consulta-vuelo', component: ConsultaVueloComponent },
  { path: 'reporte-destinos', component: ReporteDestinosComponent },
  { path: 'reporte-aerolineas', component: ReporteAerolineasComponent },
  { path: 'reporte-vuelos', component: ReporteVuelosComponent },

  // Rutas privadas
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'tripulacion', component: TripulacionComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAerolinea'] } },
  { path: 'avion', component: AvionComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAerolinea'] } },
  { path: 'vuelo', component: VueloComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAerolinea'] } },
  { path: 'abordaje', component: AbordajeComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAbordaje'] } },
  { path: 'reporte-aviones', component: ReporteAvionesComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAerolinea'] } },
  { path: 'reporte-pasajeros', component: ReportePasajerosComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAerolinea', 'ConsultasAerolinea'] } },
  { path: 'reporte-equipaje', component: ReporteEquipajeComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAerolinea', 'ConsultasAerolinea'] } },
  { path: '**', redirectTo: 'login' }
];