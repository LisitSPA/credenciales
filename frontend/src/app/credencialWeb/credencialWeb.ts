import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CollaboratorService } from '../../services/collaborators.service';

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

  constructor(private route: ActivatedRoute, private collaboratorService: CollaboratorService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.cargarDatosColaborador(id);
      } else {
        console.error('No se proporcionó el ID del colaborador');
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
        this.sede = colaborador.leadership || '';
        this.segmento = colaborador.segment || '';

      } else {
        console.error('El objeto `response.content` no contiene datos.');
      }
    }).catch(error => {
      console.error('Error al cargar los datos del colaborador:', error);
    });
  }

  agendarContacto() {
    const vCardData = `BEGIN:VCARD
    VERSION:3.0
    FN:${this.nombre}
    TEL:${this.celular}
    EMAIL:${this.correo}
    ADR:${this.sede}
    ORG:Test
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

  generarVCardURL(): string {
    const vCardData = `BEGIN:VCARD
    VERSION:3.0
    FN:${this.nombre}
    TEL:${this.celular}
    EMAIL:${this.correo}
    ADR:${this.sede}
    ORG:Test
    TITLE:${this.cargo}
    END:VCARD`;

    return 'data:text/vcard;charset=utf-8,' + encodeURIComponent(vCardData);
  }

  enviarCorreo() {
    window.location.href = `mailto:${this.correo}`;
  }
}