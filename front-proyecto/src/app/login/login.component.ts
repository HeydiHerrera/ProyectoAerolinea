import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  error: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.usuario || !this.password) {
      this.error = 'Completa todos los campos';
      return;
    }
    const body = { username: this.usuario, password: this.password };
    this.auth.login(body).subscribe({
      next: (token) => {
        this.auth.guardarToken(token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Usuario o contrasena incorrectos';
      }
    });
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }

  irA(ruta: string) {
    this.router.navigate(['/' + ruta]);
  }
}