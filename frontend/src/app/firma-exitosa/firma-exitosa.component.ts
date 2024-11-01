import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import DomToImage from 'dom-to-image';
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
  qrCodeDataUrl: string = 'https://via.placeholder.com/150';
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
      this.cargarDatosColaborador(id);
    });
  }

  cargarDatosColaborador(id: number) {
    this.collaboratorService.getCollaboratorById(id).then(colaborador => {
      if (colaborador && colaborador.content) {
        this.nombre = colaborador.content.completeName;
        console.log('Nombre asignado:', this.nombre);
        this.cargo = colaborador.content.position;
        console.log('Cargo asignado:', this.cargo);
        this.correo = colaborador.content.email;
        this.celular = colaborador.content.phone;
        this.segmento = colaborador.content.segment;
        this.area = colaborador.content.leadership;
        this.qrCodeDataUrl = colaborador.content.qrCodeUrl || this.qrCodeDataUrl;

        this.cdr.detectChanges();
      }

      console.log('Datos del colaborador obtenidos:', colaborador);
    }).catch(error => {
      console.error('Error al cargar los datos del colaborador:', error);
    });
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
          width: `${cardContainer.offsetWidth}px`,
          height: `${cardContainer.offsetHeight}px`,
        }
      };

      DomToImage.toPng(cardContainer, options)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'firma.png';
          link.click();
        })
        .catch((error) => {
          console.error('Error al generar la imagen:', error);
        });
    }
  }
}
