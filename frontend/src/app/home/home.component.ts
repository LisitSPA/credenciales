import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { MantenedoresComponent } from '../mantenedores/mantenedores.component';
import { SearchSectionComponent } from '../search-section/search-section.component';
import { CollaboratorService } from '../../services/collaborators.service';
import { GerenciaService } from '../../services/gerencia.service';
import { SegmentService } from '../../services/segment.service';
import { SpinnerService } from '../../services/spinner.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';
import { TermsConditionsComponent } from '../terms-conditions/terms-conditions.component';
import { TermsService } from '../../services/terms.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, MantenedoresComponent, SearchSectionComponent, TermsConditionsComponent, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  mostrarModalTerminos: boolean = true; 
  mostrarAdvertencia: boolean = false

  title = 'ddc-app';
  searchQuery: string = '';
  usuario = {
    email: '',
    password: ''
  };
  selectedFile: File | null = null; 
  data: any;
  canSeeHome: boolean = false;
  loading: boolean = false;
  private inactivityTimeout: any;
  private readonly INACTIVITY_TIME = 900000;

  constructor(
    private router: Router,
    private termsService: TermsService,
    private authService: AuthService,
    private renderer: Renderer2,
    private collaboratorService: CollaboratorService,
    private gerenciaService: GerenciaService,
    private spinnerService: SpinnerService,
    private http: HttpClient,
    private segmentService: SegmentService
  ) {}

  ngOnInit() {
    this.loading = true; 
    this.verificarTérminosAceptados();
    this.resetInactivityTimeout();
    this.addUserInteractionListeners();
    this.loading = false;
  }

  onSearch() {}

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
  
      if (!allowedFileTypes.includes(file.type)) {
        alert('Tipo de archivo no permitido. Solo se permiten archivos Excel o CSV.');
        this.selectedFile = null;
        return;
      }
  
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }
  
  onUpload() {
    if (this.selectedFile) {
      this.loading = true;
      this.collaboratorService.uploadMissiveCollaborator(this.selectedFile);
      this.gerenciaService.uploadMissiveGerencia(this.selectedFile);
      this.segmentService.uploadMissiveSegment(this.selectedFile);
      this.loading = false;
    } else {
      console.warn('No se ha seleccionado ningún archivo.');
    }
  }

  iniciarSesion() {
    if (this.usuario.email === "usuario@ejemplo.com" && this.usuario.password === "c") {
      console.log('Inicio de sesión exitoso');
    } else {
      console.error('Credenciales incorrectas');
    }
  }

  logout() {
    this.authService.logout();  
  }

  private isOnLoginPage(): boolean {
    const loginPaths = ['/', '/login'];
    return loginPaths.includes(window.location.pathname);
  }
  
  verificarTérminosAceptados(): void {
    const termsAccepted = localStorage.getItem('termsAccepted'); 
    if (!termsAccepted || termsAccepted !== 'true') {
      this.mostrarModalTerminos = true; 
    } else {
      this.mostrarModalTerminos = false; 
    }
  }

  handleAcceptTerms(): void {
    const userId = localStorage.getItem('collaboratorId');
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario.');
      return;
    }
  
    this.termsService.acceptTerms(parseInt(userId, 10), true).subscribe(
      response => {
        console.log('Términos aceptados:', response);
        localStorage.setItem('termsAccepted', 'true'); 
        this.mostrarModalTerminos = false; 
      },
      error => {
        console.error('Error al aceptar los términos:', error);
      }
    );
  }
  
  handleRejectTerms(): void {
    this.mostrarModalTerminos = false;
    this.mostrarAdvertencia = true;
    console.log('Rechazo de términos, mostrando advertencia.');
  }


  handleWarningAccept(): void {
    this.mostrarAdvertencia = false;
    this.mostrarModalTerminos = true;
  }

  handleLogout(): void {
    localStorage.clear(); 
    this.logout();
  }

handleWarningRejectTerms(): void {
  const userId = localStorage.getItem('collaboratorId');

  if (!userId) {
    console.error('No se pudo obtener el ID del usuario.');
    return;
  }

  this.loading = true;

  this.termsService.acceptTerms(parseInt(userId, 10), false).subscribe(
    response => {
      localStorage.clear(); 
      this.logout(); 

      setTimeout(() => {
        this.mostrarModalTerminos = false;
        this.mostrarAdvertencia = true; 
        this.loading = false; 
      }, 2000); 
    },
  );
}

  mostrarModalAyuda: boolean = false;

  openModal(event: Event): void {
    event.preventDefault(); 
    this.mostrarModalAyuda = true;
  }

  closeModal(): void {
    this.mostrarModalAyuda = false;
  }

  private handleInactivity() {
    if (!this.isOnLoginPage()) {
      alert('Su sesión ha expirado por inactividad.');
      this.logout();
    }
  }
  
  
  private resetInactivityTimeout() {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
    this.inactivityTimeout = setTimeout(() => this.handleInactivity(), this.INACTIVITY_TIME);
  }

  private addUserInteractionListeners() {
    this.renderer.listen('window', 'mousemove', () => {
      this.resetInactivityTimeout();
    });
    this.renderer.listen('window', 'keydown', (event: KeyboardEvent) => {
      this.resetInactivityTimeout();
    });
    this.renderer.listen('window', 'scroll', () => {
      this.resetInactivityTimeout();
    });
  }
  
  ngOnDestroy() {
    clearTimeout(this.inactivityTimeout);
    window.removeEventListener('mousemove', () => this.resetInactivityTimeout());
    window.removeEventListener('keydown', () => this.resetInactivityTimeout());
  }
}
