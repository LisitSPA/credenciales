import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DescargarCredencialComponent } from '../descargar-credencial/descargar-credencial.component';
import { GenerarFirmaComponent } from '../generar-firma/generar-firma.component'; 

@Component({
  selector: 'app-generar-credencial',
  standalone: true,
  imports: [FormsModule, CommonModule,DescargarCredencialComponent,GenerarFirmaComponent,],
  templateUrl: './generar-credencial.component.html',
  styleUrl: './generar-credencial.component.css'
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
  adjuntaFirma: boolean = false;
  adjuntaCredencial: boolean = false;
  foto: File | null = null;

  @Output() cerrar = new EventEmitter<void>();

  guardarDatos() {
    const userData = {
      nombre: this.nombre,
      rut: this.rut,
      gerencia: this.gerencia,
      cargo: this.cargo,
      segmento: this.segmento,
      celular: this.celular,
      correo: this.correo,
      sede: this.sede,
      adjuntaFirma: this.adjuntaFirma,
      adjuntaCredencial: this.adjuntaCredencial,
      foto: this.foto
    };
    
    console.log(userData);
    this.cerrar.emit();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.foto = input.files[0];
    }
  }
}
