import { Routes } from '@angular/router';
import { PaseAbordarComponent } from './pase-abordar/pase-abordar.component';
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
import { MisVuelosComponent } from './mis-vuelos/mis-vuelos.component';
import { CompraBoletoComponent } from './compra-boleto/compra-boleto.component';
import { AuthGuard } from './guards/auth.guard';
import { RolGuard } from './guards/rol.guard';
import { BitacoraComponent } from './bitacora/bitacora.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'bitacora', component: BitacoraComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAerolinea'] } },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'consulta-vuelo', component: ConsultaVueloComponent },
  { path: 'reporte-destinos', component: ReporteDestinosComponent },
  { path: 'reporte-aerolineas', component: ReporteAerolineasComponent },
  { path: 'reporte-vuelos', component: ReporteVuelosComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'mis-vuelos', component: MisVuelosComponent, canActivate: [RolGuard], data: { roles: ['PASAJERO'] } },
  { path: 'compra-boleto', component: CompraBoletoComponent, canActivate: [RolGuard], data: { roles: ['PASAJERO'] } },
  { path: 'tripulacion', component: TripulacionComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAerolinea'] } },
  { path: 'avion', component: AvionComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAerolinea'] } },
  { path: 'vuelo', component: VueloComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAerolinea'] } },
  { path: 'abordaje', component: AbordajeComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAbordaje'] } },
  { path: 'reporte-aviones', component: ReporteAvionesComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAerolinea'] } },
  { path: 'reporte-pasajeros', component: ReportePasajerosComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAerolinea', 'ConsultasAerolinea'] } },
  { path: 'reporte-equipaje', component: ReporteEquipajeComponent, canActivate: [RolGuard], data: { roles: ['AdministradorAerolinea', 'ConsultasAerolinea'] } },
  { path: 'pase-abordar', component: PaseAbordarComponent, canActivate: [RolGuard], data: { roles: ['PASAJERO'] } },
  { path: '**', redirectTo: 'login' }
];