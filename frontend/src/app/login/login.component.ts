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
  newPassword = '';
  mensajeError = '';
  loading: boolean = false;
  showModal: boolean = false; 
  userId: number | null = null; 

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
          const token = response.token;
          const decodedToken = this.decodeToken(token);
          const userRole = decodedToken.role;
          const collaboratorId = response.collaboratorId; 
          const requiresPasswordChange = response.requiresPasswordChange;

          localStorage.setItem('token', token);
          localStorage.setItem('userId', response.id.toString());
          localStorage.setItem('role', userRole);
  
          if (requiresPasswordChange) {
            this.userId = response.id;
            this.showModal = true;
          } else {
            if (userRole === 'Colaborador' && collaboratorId) {
              this.loadCollaboratorDetails(collaboratorId);
            } else {
              this.router.navigate(['/home']);
            }
          }
        },
        error => {
          this.spinnerService.hideSpinner();
          this.loading = false;
          this.mensajeError = 'Correo electrónico o contraseña incorrectos';
          console.error(error);
        }
      );
  }

  private loadCollaboratorDetails(collaboratorId: number) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
  
    this.http.get<any>(`${environment.apiUrl}/collaborators/${collaboratorId}`, { headers })
      .subscribe(
        collaboratorResponse => {
          console.log('Respuesta del backend:', collaboratorResponse); 
  
          const collaboratorData = collaboratorResponse.content || collaboratorResponse;
  
          if (collaboratorData) {
            const formattedCollaborator = {
              id: collaboratorData.id,
              nombre: collaboratorData.completeName,
              rut: collaboratorData.rut,
              segmento: collaboratorData.segment,
              nombreSegmento: collaboratorData.segment,
              gerencia: collaboratorData.leadership,
              nombreGerencia: collaboratorData.leadership,
              cargo: collaboratorData.position,
              celular: collaboratorData.phone,
              correo: collaboratorData.email,
              estado: collaboratorData.status,
              sede: collaboratorData.area
            };
  
            localStorage.setItem('print', JSON.stringify(formattedCollaborator));
            console.log('Datos guardados en print:', formattedCollaborator); 
          } else {
            console.error('La respuesta no contiene los datos esperados.');
          }
  
          this.router.navigate(['/generar']); 
        },
        error => {
          console.error('Error al obtener los datos del colaborador:', error);
          this.router.navigate(['/home']); 
        }
      );
  }
  
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload); 
      return JSON.parse(decoded); 
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
  
  handleRecoverPasswordClick(): void {
    window.location.href = 'https://ambitious-plant-061bff30f.4.azurestaticapps.net/recover-password?returnUrl=credenciales';
  }

  handleSupportClick(): void {
    alert('Por favor, contacta al soporte para solicitar acceso.');
  }

  handleChangePassword() {
    const token = localStorage.getItem('token'); 
    const headers = { Authorization: `Bearer ${token}` }; 
  
    const payload = {
      username: this.usuario.email,
      oldPassword: this.usuario.password,
      newPassword: this.newPassword
    };
  
    this.http.put(`${environment.apiUrl}/auth/changePassword`, payload, { headers })
      .subscribe(
        () => {
          alert('Contraseña actualizada con éxito. Por favor, inicie sesión nuevamente.');
          this.showModal = false;
          this.router.navigate(['/login']);
        },
        error => {
          alert('Error al cambiar la contraseña. Inténtalo nuevamente.');
          console.error('Error:', error);
        }
      );
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

  closeModalPass(): void {
    this.showModal = false; 
  }
  
}
