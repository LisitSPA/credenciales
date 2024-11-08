import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CollaboratorService } from '../../services/collaborators.service';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

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

        console.log('Datos del colaborador cargados:', colaborador);
      } else {
        console.error('El objeto `response.content` no contiene datos.');
      }
    }).catch(error => {
      console.error('Error al cargar los datos del colaborador:', error);
    });
  }

  async abrirContacto() {
    if (Capacitor.isNativePlatform()) {
      if (Capacitor.getPlatform() === 'android') {
        const androidIntentUrl = `intent://contacts?action=android.intent.action.INSERT&name=${encodeURIComponent(this.nombre)}&phone=${encodeURIComponent(this.celular)}&email=${encodeURIComponent(this.correo)}#Intent;scheme=content;package=com.android.contacts;end`;
        try {
          await Browser.open({ url: androidIntentUrl });
        } catch (err) {
          console.error('Error al abrir contacto en Android:', err);
        }
      }
      else if (Capacitor.getPlatform() === 'ios') {
        const iosUrl = `contact://add?name=${encodeURIComponent(this.nombre)}&phone=${encodeURIComponent(this.celular)}&email=${encodeURIComponent(this.correo)}`;
        try {
          await Browser.open({ url: iosUrl });
        } catch (err) {
          console.error('Error al abrir contacto en iOS:', err);
        }
      }
    } else {
      console.error('Abrir contactos solo es compatible en plataformas nativas.');
    }
  }

  enviarCorreo() {
    window.location.href = `mailto:${this.correo}`;
  }
}
