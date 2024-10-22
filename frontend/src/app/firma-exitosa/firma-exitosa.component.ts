import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import DomToImage from 'dom-to-image';

@Component({
  selector: 'app-firma-exitosa',
  standalone: true,
  templateUrl: './firma-exitosa.component.html',
  styleUrls: ['./firma-exitosa.component.css'],
  imports: [FormsModule, CommonModule]
})
export class FirmaExitosaComponent implements OnInit {
  nombre: string = 'Juan Pérez';
  cargo: string = 'Export Manager';
  correo: string = 'juan.perez@example.com';
  celular: string = '+56 9 8765 4321';
  qrCodeDataUrl: string = '';
  segmento: string = 'Segmento Comercial';
  area: string = 'Área de Ventas';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.nombre = 'Nicolás Troncoso';
    this.cargo = 'Export Manager';
    this.correo = 'nicolas.troncoso@ddc.cl';
    this.celular = '+56 9 8765 4321';
    this.segmento = 'Segmento Comercial';
    this.area = 'Área de Ventas';
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
          height: `${cardContainer.offsetHeight}px` ,
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