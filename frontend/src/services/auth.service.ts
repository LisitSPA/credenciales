import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');  
    sessionStorage.removeItem('token'); 
    this.router.navigate(['/']); 
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
  }
}
