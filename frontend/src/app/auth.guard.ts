import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token && !this.isTokenExpired(token)) {
      return true;
    } else {
      this.logout()
      return false;
    }
  }

  isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del token
    const expirationDate = new Date(payload.exp * 1000); // El campo 'exp' está en segundos
    return expirationDate < new Date();
  }
 
  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

}
