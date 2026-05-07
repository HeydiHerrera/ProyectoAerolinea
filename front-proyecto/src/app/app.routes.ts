import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { TripulacionComponent } from './tripulacion/tripulacion.component';
import { AvionComponent } from './avion/avion.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tripulacion', component: TripulacionComponent },
  { path: 'avion', component: AvionComponent },
  { path: '**', redirectTo: 'login' }
];