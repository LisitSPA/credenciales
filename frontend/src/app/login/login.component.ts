import { Component } from '@angular/core'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { HttpClient } from '@angular/common/http'; 
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = {
    email: '',
    password: ''
  };
  mensajeError = '';
  loading: boolean = false;


  constructor(private router: Router, private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/home']);
    }
  }


  gotoHome() {
    if (this.loading) return;
  
    this.loading = true;
    const loginCommand = {
      username: this.usuario.email,
      password: this.usuario.password
    };
  
    this.http.post<{ token: string }>(`${environment.apiUrl}/auth/login`, loginCommand, { withCredentials: true })
      .subscribe(response => {
        this.loading = false;
        console.log('Inicio de sesión exitoso');
        this.router.navigate(['/home']);
      }, error => {
        this.loading = false;
        this.mensajeError = 'Correo electrónico o contraseña incorrectos';
        console.error(error);
      });
  }
  
}