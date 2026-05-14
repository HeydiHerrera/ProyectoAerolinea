import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  error: string = '';
  success: string = '';
  mostrarPassword: boolean = false;
  mostrarConfirmacion: boolean = false;

  reg = {
    pasaporte: '',
    nombre: '',
    fechaNacimiento: '',
    nacionalidad: '',
    correo: '',
    codigoArea: '',
    telefono: '',
    telefonoEmergencia: '',
    direccion: '',
    password: ''
  };

  constructor(private auth: AuthService, private router: Router) {}

  validar() {
    if (!this.reg.pasaporte || !this.reg.nombre || !this.reg.fechaNacimiento ||
        !this.reg.nacionalidad || !this.reg.correo || !this.reg.codigoArea ||
        !this.reg.telefono || !this.reg.telefonoEmergencia || !this.reg.direccion) {
      this.error = 'Debe ingresar los campos obligatorios';
      return;
    }
    if (this.reg.pasaporte.length > 15) {
      this.error = 'El numero de pasaporte no puede tener mas de 15 caracteres';
      return;
    }
    if (!/^\d+$/.test(this.reg.telefono)) {
      this.error = 'El telefono solo debe contener digitos';
      return;
    }
    if (this.reg.telefono.length !== 8) {
      this.error = 'El telefono debe tener exactamente 8 digitos';
      return;
    }
    this.error = '';
    this.mostrarPassword = true;
  }

  confirmarPassword() {
    const regex = /^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.*[0-9]).{6,}$/;
    if (!regex.test(this.reg.password)) {
      this.error = 'El formato de la contrasena debe incluir al menos una letra mayuscula, un caracter especial y un numero';
      return;
    }
    this.error = '';
    this.mostrarPassword = false;
    this.mostrarConfirmacion = true;
  }

  registrarse() {
    this.auth.registro(this.reg).subscribe({
      next: (res) => {
        this.success = res;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        if (err.status === 409) {
          this.error = 'El numero de pasaporte ingresado ya cuenta con usuario.';
        } else {
          this.error = 'Error al registrar. Intenta de nuevo.';
        }
        this.mostrarConfirmacion = false;
        this.mostrarPassword = false;
      }
    });
  }

  cancelarRegistro() {
    this.success = 'Se ha cancelado el registro satisfactoriamente';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
