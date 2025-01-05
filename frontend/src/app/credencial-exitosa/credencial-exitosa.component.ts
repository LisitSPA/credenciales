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
  fileType: any;
  photoBase64: any;
  segmentoColor: string = '';
  segmentColors: { [key: string]: string } = {
    'Calidad': '#ff9999',
    'Mantención': '#ffda79',
    'Agrícola': '#79d279',
    'Bodega': '#cccccc',
    'Patio': '#999999',
    'Frigorífico': '#79c2ff',
    'Packing': '#6666ff',
    'Administración': '#008080',
  };

  constructor(
    private route: ActivatedRoute,
    private collaboratorService: CollaboratorService,
    private cdr: ChangeDetectorRef,
    private router: Router 
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
    console.log('Cargando datos del colaborador...');
    this.collaboratorService.getCollaboratorById(id).then(response => {
      console.log('Datos del colaborador cargados:', response);
      if (response && response.content) {
        const colaborador = response.content;

        this.nombre = colaborador.completeName || '';
        this.cargo = colaborador.position || '';
        this.correo = colaborador.email || '';
        this.celular = colaborador.phone || '';
        this.segmento = colaborador.segment || '';
        this.area = colaborador.leadership || '';
        this.fileType = colaborador.attachments[0]?.fileType || 'image/png';
        this.photoBase64 = colaborador.attachments[0]?.base64 || null;
        this.segmento = colaborador.segment || '';
        this.cargo = colaborador.position || '';
        
        this.segmentoColor = this.segmentColors[this.segmento] || '#000000';
        
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

    // const url =
    // window.location.hostname === 'localhost'
    //   ? `http://localhost:4200/credencialweb?id=${id}&color=${encodeURIComponent(this.segmentoColor)}`
    //   : `https://proud-water-04c9dae10.5.azurestaticapps.net/credencialweb?id=${id}&color=${encodeURIComponent(this.segmentoColor)}`;

    try {
      this.qrCodeDataUrl = await QRCode.toDataURL(url);
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
