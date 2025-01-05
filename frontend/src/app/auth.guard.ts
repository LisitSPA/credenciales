import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {

    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');

      if (token && !this.isTokenExpired(token)) {
        return true;
      } else {
        this.logout(); 
        return false;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }

  isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload
    const expirationDate = new Date(payload.exp * 1000); // 'exp' está en segundos
    return expirationDate < new Date();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
