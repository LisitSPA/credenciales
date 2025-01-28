import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import DomToImage from 'dom-to-image';
import QRCode from 'qrcode';
import { CollaboratorService } from '../../services/collaborators.service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';


@Component({
  selector: 'app-firma-exitosa',
  standalone: true,
  templateUrl: './firma-exitosa.component.html',
  styleUrls: ['./firma-exitosa.component.css'],
  imports: [FormsModule, CommonModule]
})
export class FirmaExitosaComponent implements OnInit {
  nombre: string = '';
  cargo: string = '';
  correo: string = '';
  celular: string = '';
  qrCodeDataUrl: string = ''; 
  segmento: string = '';
  area: string = '';
  canSeeHome: boolean = false;

  private inactivityTimeout: any;
  private readonly INACTIVITY_TIME = 900000;

  constructor(
    private route: ActivatedRoute,
    private collaboratorService: CollaboratorService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.cargarDatosColaborador(id);
      } else {
        console.error('No se proporcionó el ID del colaborador.');
      }
    });
    this.resetInactivityTimeout();
    this.addUserInteractionListeners();
  }

  cargarDatosColaborador(id: number) {
    this.collaboratorService.getCollaboratorById(id).then(colaborador => {
      if (colaborador && colaborador.content) {
        this.nombre = colaborador.content.completeName;
        this.cargo = colaborador.content.position;
        this.correo = colaborador.content.email;
        this.celular = colaborador.content.phone;
        this.segmento = colaborador.content.segment;
        this.area = colaborador.content.leadership;

        this.generarQRCode(id);

        this.cdr.detectChanges();
      } else {
        console.error('El objeto `response.content` no contiene datos.');
      }
    }).catch(error => {
      console.error('Error al cargar los datos del colaborador:', error);
    });
  }

  async generarQRCode(id: number) {
    const url = `https://proud-water-04c9dae10.5.azurestaticapps.net/credencialweb?id=${id}`;

    try {
      this.qrCodeDataUrl = await QRCode.toDataURL(url);
    } catch (error) {
      console.error('Error generando QR Code:', error);
    }
  }

  descargarImagen() {
    const cardContainer = document.querySelector('.download') as HTMLElement;
    if (cardContainer) {
      const options = {
        quality: 1,
        bgcolor: '#FFFFFF',
        width: cardContainer.offsetWidth,
        height: cardContainer.offsetHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          backgroundColor: '#FFFFFF',
          padding: '0px', 
          margin: 'auto',
          border: 'none',
          boxSizing: 'border-box',
          width: `${cardContainer.offsetWidth}px`,
          height: `${cardContainer.offsetHeight}px`,
          fontFamily: 'Titillium Web, sans-serif', 
        }
      };
  
      DomToImage.toPng(cardContainer, options)
        .then(function (dataUrl) {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'firma.png';
          link.click();
        })
        .catch(function (error) {
          console.error('Error al generar la imagen:', error);
        });
    }
  }  
  
  logout() {
    this.authService.logout();  
  }

  private isOnLoginPage(): boolean {
    const loginPaths = ['/', '/login'];
    return loginPaths.includes(window.location.pathname);
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
