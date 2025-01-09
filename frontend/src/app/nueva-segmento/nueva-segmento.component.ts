import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SegmentService } from '../../services/segment.service';

@Component({
  selector: 'app-nueva-segmento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-segmento.component.html',
  styleUrls: ['./nueva-segmento.component.css']
})
export class NuevaSegmentoComponent {
  @Input() mostrarModal: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<{ Description: string, Color: string}>(); 
  nombreSegmento: string = '';
  colorSegmento: string = '';

  constructor(private segmentService: SegmentService) { }

  cerrarModal() {
    this.cerrar.emit();
  }

  async crearSegmento() {
    if (this.nombreSegmento.trim() && this.colorSegmento.trim()) {
      try {
        this.guardar.emit({
          Description: this.nombreSegmento,
          Color: this.colorSegmento,
        });
        this.cerrarModal(); 
      } catch (error: unknown) {
        const err = error as any; 
        console.error('Error al crear el segmento:', err);
        if (err.message && err.message.includes('El segmento con este nombre ya existe')) {
          alert('El segmento con este nombre ya existe. Por favor, elige un nombre diferente.');
        } else {
          alert('Hubo un error al crear el segmento. Verifica la conexión y los datos proporcionados.');
        }
      }
    } else {
      console.error('El nombre o el color del segmento no pueden estar vacíos.');
      alert('El nombre y el color del segmento son obligatorios.');
    }
  }
  
}