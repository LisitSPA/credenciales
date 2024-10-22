import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  @Output() guardar = new EventEmitter<{ Description: string, Color: string, Active: boolean }>(); 
  nombreSegmento: string = '';
  colorSegmento: string = '';
  estadoSegmento: boolean = true;  

  cerrarModal() {
    this.cerrar.emit();
  }

  crearSegmento() {
    if (this.nombreSegmento.trim() && this.colorSegmento.trim()) {
      this.guardar.emit({
        Description: this.nombreSegmento, 
        Color: this.colorSegmento,         
        Active: this.estadoSegmento       
      });
      this.cerrarModal(); 
    } else {
      console.error('El nombre o el color del segmento no pueden estar vacíos.');
    }
  }
}
