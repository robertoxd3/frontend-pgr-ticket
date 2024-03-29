import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    var usuario= localStorage.getItem('user');

    if (usuario!=null && usuario!="null") {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión si no está autenticado.
      return false;
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    window.location.reload();
  }
}




