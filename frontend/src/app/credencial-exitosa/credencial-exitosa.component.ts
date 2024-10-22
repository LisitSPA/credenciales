import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import DomToImage from 'dom-to-image';


@Component({
  selector: 'app-credencial-exitosa',
  standalone: true,
  templateUrl: './credencial-exitosa.component.html',
  styleUrls: ['./credencial-exitosa.component.css'],
  imports: [FormsModule, CommonModule]
})
export class CredencialExitosaComponent implements OnInit {
  nombre: string = 'Juan Pérez';
  cargo: string = 'Gerente de Ventas';
  correo: string = 'juan.perez@example.com';
  celular: string = '+56 9 1234 5678';
  qrCodeDataUrl: string = 'https://via.placeholder.com/150';
  segmento: string = 'Ventas';
  area: string = 'Comercial';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.cargarDatosColaborador(id);
    });
  }

  cargarDatosColaborador(id: number) {
 
    const colaborador = {
      nombre: 'Valentina Darraidou Aguirre',
      cargo: 'Brandmanager',
      correo: 'ana.martinez@example.com',
      celular: '+56 9 8765 4321',
      segmento: 'Gerencia Comercial',
      area: 'Gerencia Comercial',
      qrCodeUrl: 'https://via.placeholder.com/150'
    };

    this.nombre = colaborador.nombre || this.nombre;
    this.cargo = colaborador.cargo || this.cargo;
    this.correo = colaborador.correo || this.correo;
    this.celular = colaborador.celular || this.celular;
    this.segmento = colaborador.segmento || this.segmento;
    this.area = colaborador.area || this.area;
    this.qrCodeDataUrl = colaborador.qrCodeUrl || this.qrCodeDataUrl;

    console.log('Datos del colaborador obtenidos:', colaborador);
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
          link.download = 'firma.png';
          link.click();
        })
        .catch((error) => {
          console.error('Error al generar la imagen:', error);
        });
    }
  }
}