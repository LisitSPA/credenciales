import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private spinnerService: SpinnerService
  ) {}

  logout() {
    this.spinnerService.showSpinner();
    setTimeout(() => {
      localStorage.removeItem('token');  
      sessionStorage.removeItem('token'); 
      this.router.navigate(['/']); 
      this.spinnerService.hideSpinner();
    }, 1500); 
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
  }
}
