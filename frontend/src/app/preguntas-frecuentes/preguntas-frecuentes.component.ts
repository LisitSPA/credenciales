import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preguntas-frecuentes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrls: ['./preguntas-frecuentes.component.css'],
})
export class PreguntasFrecuentesComponent {
  preguntas = [
    {
      pregunta: '¿Cómo puedo acceder al portal de "Credenciales"?',
      respuesta: `
        Para acceder al portal "Credenciales" de David del Curto, sigue estos pasos:
        <ol>
          <li><b>Acceso al portal:</b> Ingresa a <a href="https://credenciales.ddc.cl" target="_blank">https://credenciales.ddc.cl/</a>.</li>
          <li><b>Inicio de sesión:</b> Introduce tu nombre de usuario y contraseña en los campos correspondientes.</li>
          <li><b>Recuperación de contraseña:</b>
            <ul>
              <li>Si has olvidado tu contraseña, haz clic en el enlace "¿Olvidaste tu contraseña?" ubicado en la página de inicio de sesión.</li>
              <li>Serás redirigido a una página donde deberás ingresar tu dirección de correo electrónico asociada a tu cuenta.</li>
              <li>Tras enviar tu correo electrónico, recibirás un mensaje con un enlace para restablecer tu contraseña.</li>
              <li>Haz clic en el enlace proporcionado en el correo y sigue las instrucciones para establecer una nueva contraseña.</li>
            </ul>
          </li>
          <li>Si aún no tienes acceso al portal, en la misma página de inicio puedes solicitarlo haciendo clic en "Solicítalo aquí".</li>
        </ol>
        Para cualquier inconveniente o duda adicional, puedes contactar al soporte técnico de David del Curto para recibir asistencia personalizada:
        <br />
        <a href="mailto:soporteTI@ddc.cl">soporteTI@ddc.cl</a>.
      `,
    },
    {
      pregunta: '¿Qué puedo hacer si detecto un error en la página?',
      respuesta: `
        Procedimiento para notificar errores y recibir soporte.
      `,
    },

  ];

  abiertoIndex: number | null = null;

  toggleAcordeon(index: number): void {
    this.abiertoIndex = this.abiertoIndex === index ? null : index;
  }
}