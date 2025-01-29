import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';  
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario = {
    email: '',
    password: ''
  };
  mensajeError = '';
  loading: boolean = false;

  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/home']);  
    }
  }

  gotoHome() {
    if (this.loading) return;  
  
    this.loading = true;
    this.spinnerService.showSpinner();  
    const loginCommand = {
      username: this.usuario.email,
      password: this.usuario.password
    };
  
    this.http.post<any>(`${environment.apiUrl}/auth/login`, loginCommand)
      .subscribe(
        response => {
          this.spinnerService.hideSpinner();  
          localStorage.setItem('token', response.token);  // Guarda el token
          localStorage.setItem('userId', response.id.toString());  // Guarda el ID del usuario
          this.router.navigate(['/home']);  
        },
        error => {
          this.spinnerService.hideSpinner();  
          this.loading = false;
          this.mensajeError = 'Correo electrónico o contraseña incorrectos';  
          console.error(error);  
        }
      );
  }
  
  

  handleRecoverPasswordClick(): void {
    window.location.href = 'https://ambitious-plant-061bff30f.4.azurestaticapps.net/recover-password?returnUrl=credenciales';
  }

  handleSupportClick(): void {
    alert('Por favor, contacta al soporte para solicitar acceso.');
  }

  openModal(): void {
    const modal = document.getElementById('supportModal');
    if (modal) {
      modal.style.display = 'block'; 
    }
  }

  closeModal(): void {
    const modal = document.getElementById('supportModal');
    if (modal) {
      modal.style.display = 'none'; 
    }
  }
}
