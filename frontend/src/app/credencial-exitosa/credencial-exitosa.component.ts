import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import DomToImage from 'dom-to-image';
import QRCode from 'qrcode';
import { CollaboratorService } from '../../services/collaborators.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-credencial-exitosa',
  standalone: true,
  templateUrl: './credencial-exitosa.component.html',
  styleUrls: ['./credencial-exitosa.component.css'],
  imports: [FormsModule, CommonModule]
})
export class CredencialExitosaComponent implements OnInit {
  nombre: string = '';
  cargo: string = '';
  correo: string = '';
  celular: string = '';
  qrCodeDataUrl: string = ''; 
  segmento: string = '';
  area: string = '';

  constructor(
    private route: ActivatedRoute,
    private collaboratorService: CollaboratorService,
    private cdr: ChangeDetectorRef,
    private router: Router 
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('ID recibido desde la ruta:', id); 
      if (id) {
        this.cargarDatosColaborador(id);
      } else {
        console.error('No se proporcionó el ID del colaborador.');
      }
    });
  }

  cargarDatosColaborador(id: number) {
    this.collaboratorService.getCollaboratorById(id).then(response => {
      if (response && response.content) {
        const colaborador = response.content;

        this.nombre = colaborador.completeName || '';
        this.cargo = colaborador.position || '';
        this.correo = colaborador.email || '';
        this.celular = colaborador.phone || '';
        this.segmento = colaborador.segment || '';
        this.area = colaborador.leadership || '';

        console.log('Datos del colaborador:', colaborador); 

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

    console.log('URL para el QR:', url); 

    try {
      this.qrCodeDataUrl = await QRCode.toDataURL(url);
      console.log('QR Code generado:', this.qrCodeDataUrl); 
    } catch (error) {
      console.error('Error generando QR Code:', error);
    }
  }

  descargarImagen() {
    const cardContainer = document.querySelector('.card-container') as HTMLElement;
    if (cardContainer) {
      const options = {
        quality: 1,
        bgcolor: '#FFFFFF', 
      };
      
      DomToImage.toPng(cardContainer, options)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'credencial.png';
          link.click();
        })
        .catch((error) => {
          console.error('Error al generar la imagen:', error);
        });
    }
  }

  cerrar() {
    this.router.navigate(['/colaboradores']);
  }
}
