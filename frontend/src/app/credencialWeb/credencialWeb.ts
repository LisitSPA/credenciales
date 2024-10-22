import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-credencialWeb',
  standalone: true,
  templateUrl: './credencialWeb.html',
  styleUrls: ['./credencialWeb.css'],
})
export class CredencialWebComponent implements OnInit {
  nombre: string = '';
  cargo: string = '';
  correo: string = '';
  celular: string = '';
  sede: string = '';
  segmento: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.inicializarDatos();
  }

  inicializarDatos() {
    if (typeof window !== 'undefined' && localStorage) {
      const colaborador = localStorage.getItem('colaboradorData');
      if (colaborador) {
        const data = JSON.parse(colaborador);
        this.nombre = data.nombre;
        this.cargo = data.cargo;
        this.correo = data.correo;
        this.celular = data.celular;
        this.sede = data.sede;
        this.segmento = data.segmento;
      } else {
        console.error('No se encontraron datos de colaborador en localStorage');
      }
    } else {
      console.error('localStorage no está disponible');
    }
  }

  descargarContacto() {
    const vCardData = `BEGIN:VCARD
    VERSION:3.0
    FN:${this.nombre}
    TEL:${this.celular}
    EMAIL:${this.correo}
    ADR:${this.sede}
    ORG:David del Curto
    TITLE:${this.cargo}
    END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.nombre}.vcf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  enviarCorreo() {
    window.location.href = `mailto:${this.correo}`;
  }
}
