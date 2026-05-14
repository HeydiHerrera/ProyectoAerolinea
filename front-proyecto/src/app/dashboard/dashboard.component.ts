import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  rol: string = '';
  username: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.rol = this.auth.getRol();
    this.username = this.auth.getUsername();
    console.log('Rol en dashboard:', this.rol);
    if (!this.rol) {
      this.router.navigate(['/login']);
    }
  }

  irA(ruta: string) {
    this.router.navigate(['/' + ruta]);
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
