import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const rolesPermitidos = route.data['roles'] as string[];
    const rolActual = this.auth.getRol();

    if (!rolActual) {
      this.router.navigate(['/login']);
      return false;
    }

    if (rolesPermitidos && !rolesPermitidos.includes(rolActual)) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}