import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generar-credencial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generar-credencial.component.html',
  styleUrls: ['./generar-credencial.component.css']
})
export class GenerarCredencialComponent {
  nombre: string = '';
  rut: string = '';
  gerencia: string = '';
  cargo: string = '';
  segmento: string = '';
  celular: string = '';
  correo: string = '';
  sede: string = '';
  foto: File | null = null;
  qrCodeUrl: string | undefined;

  @Output() cerrar = new EventEmitter<void>();

  private ipLocal: string = '192.168.3.102'; 

  constructor(private router: Router) {}

  async guardarDatos() {
    if (!this.nombre || !this.cargo || !this.correo) {
      alert('Por favor, rellena los campos obligatorios.');
      return;
    }

    const userData = {
      nombre: this.nombre,
      rut: this.rut,
      gerencia: this.gerencia,
      cargo: this.cargo,
      segmento: this.segmento,
      celular: this.celular,
      correo: this.correo,
      sede: this.sede,
      foto: this.foto,
    };

    await this.generateQRCode();
    localStorage.setItem('colaboradorData', JSON.stringify({ ...userData, qrCodeUrl: this.qrCodeUrl }));

    this.router.navigate(['/firmaexitosa']);
  }

  async generateQRCode() {
    const url = `http://${this.ipLocal}:4200/credencialweb`;

    try {
      this.qrCodeUrl = await QRCode.toDataURL(url);
      console.log('QR Code generado:', this.qrCodeUrl);
    } catch (err) {
      console.error('Error generando QR Code:', err);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.foto = input.files[0];
    }
  }
}
