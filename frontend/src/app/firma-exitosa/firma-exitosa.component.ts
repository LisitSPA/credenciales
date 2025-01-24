import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import DomToImage from 'dom-to-image';
import QRCode from 'qrcode';
import { CollaboratorService } from '../../services/collaborators.service';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(
    private route: ActivatedRoute,
    private collaboratorService: CollaboratorService,
    private cdr: ChangeDetectorRef
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
}
