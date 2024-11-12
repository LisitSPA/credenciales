import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CollaboratorService } from '../../services/collaborators.service';
import { SegmentService } from '../../services/segment.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-modificar-segmento',
  standalone: true,
  imports: [FormsModule, CommonModule,],

  templateUrl: './modificar-segmento.component.html',
  styleUrls: ['./modificar-segmento.component.css']
})
export class ModificarSegmentoComponent implements OnInit {
  @Input() segmento: any; 
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();
  nombreSegmento: string = '';
  colorSegmento: string = '';

  segmentos: any[] = [];  

  constructor(
    private segmentoService: SegmentService
  ) {}
  ngOnInit() {
    if (this.segmento) {
      this.nombreSegmento = this.segmento.nombreCompleto;
      this.colorSegmento = this.segmento.color;
    }
  }




  async loadSegmentos() {
    try {
      const page = 1;        
      const pageSize = 100;    
  
      const response = await this.segmentoService.getPaginatedSegments(page, pageSize);
      
      if (response && response.content && response.content.data) {
        this.segmentos = response.content.data.map((segment: any) => ({
          id: segment.id,
          description: segment.description,
        }));
      } else {
        console.error('No se encontraron datos en la respuesta:', response);
      }
    } catch (error) {
      console.error('Error al cargar segmentos:', error);
    }
  }
  
  guardarDatos() {
    if (!this.segmento || !this.segmento.id) {
      console.error('El segmento no está definido o no tiene ID válido:', this.segmento);
      alert('Error: No se pudo editar el segmento porque la información no es válida.');
      return;
    }
  
    const segmentoModificado = {
      id: this.segmento.id,
      nombreCompleto: this.nombreSegmento,
      color: this.colorSegmento,
      activo: this.segmento.activo
    };
  
    this.guardar.emit(segmentoModificado);
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
  }
}
