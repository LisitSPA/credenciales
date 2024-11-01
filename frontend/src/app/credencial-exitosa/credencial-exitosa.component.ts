import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import DomToImage from 'dom-to-image';
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
      if (colaborador) {
        this.nombre = colaborador.completeName || this.nombre;
        this.cargo = colaborador.position || this.cargo;
        this.correo = colaborador.email || this.correo;
        this.celular = colaborador.phone || this.celular;
        this.segmento = colaborador.segment || this.segmento;
        this.area = colaborador.leadership || this.area;
        this.qrCodeDataUrl = colaborador.qrCodeUrl || this.qrCodeDataUrl;
        

        this.cdr.detectChanges();
      }
      console.log('Nombre obtenido:', this.nombre);
      console.log('Cargo obtenido:', this.cargo);

      console.log('Datos del colaborador obtenidos:', colaborador);
    }).catch(error => {
      console.error('Error al cargar los datos del colaborador:', error);
    });
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
}
