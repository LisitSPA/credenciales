import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loading: boolean = false;
  constructor(
    private router: Router,
    private spinnerService: SpinnerService
  ) {}

  logout() {
    this.loading = true;
    setTimeout(() => {
      localStorage.removeItem('token');  
      sessionStorage.removeItem('token'); 
      this.router.navigate(['/']); 
      this.loading = false;
    }, 1500); 
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
  }
}
