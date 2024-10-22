import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaboratorService } from '../../services/collaborators.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modificar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.css']
})
export class ModificarComponent implements OnChanges {
  @Input() colaborador: any;
  @Output() cerrar = new EventEmitter<void>();

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

  constructor(private collaboratorService: CollaboratorService) {}

  ngOnChanges() {
    if (this.colaborador) {
      this.nombre = this.colaborador.nombre;
      this.rut = this.colaborador.rut;
      this.gerencia = this.colaborador.gerencia;
      this.cargo = this.colaborador.cargo;
      this.segmento = this.colaborador.segmento;
      this.celular = this.colaborador.celular;
      this.correo = this.colaborador.correo;
      this.sede = this.colaborador.sede;
    }
  }

  async guardarDatos() {
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

    try {
      console.log('Colaborador modificado exitosamente');
    } catch (error) {
      console.error('Error al modificar colaborador:', error);
    } finally {
      this.cerrar.emit(); 
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.foto = input.files[0];
    }
  }
}
