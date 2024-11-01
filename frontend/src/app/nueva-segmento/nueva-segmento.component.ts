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
        console.log('Color seleccionado:', this.colorSegmento);
  
        await this.segmentService.createSegment(this.nombreSegmento, this.colorSegmento);
        console.log('Segmento creado exitosamente');
  
        this.guardar.emit({
          Description: this.nombreSegmento,
          Color: this.colorSegmento,
          
        });
  
        this.cerrarModal(); 
      } catch (error) {
        console.error('Error al crear el segmento:', error);
        alert('Hubo un error al crear el segmento. Verifica la conexión y los datos proporcionados.');
      }
    } else {
      console.error('El nombre o el color del segmento no pueden estar vacíos.');
      alert('El nombre y el color del segmento son obligatorios.');
    }
  }
  
}