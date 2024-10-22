import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CollaboratorService } from '../../services/collaborators.service';
import { SegmentService } from '../../services/segment.service';
import { GerenciaService } from '../../services/gerencia.service';  
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-modificar-colaborador',
  standalone: true,
  imports: [FormsModule, CommonModule,],

  templateUrl: './modificar-colaborador.component.html',
  styleUrls: ['./modificar-colaborador.component.css']
})
export class ModificarColaboradorComponent implements OnInit {
  @Input() colaborador: any; 
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  gerencias: any[] = [];  
  segmentos: any[] = [];  

  constructor(
    private collaboratorService: CollaboratorService,
    private gerenciaService: GerenciaService,
    private segmentoService: SegmentService
  ) {}
  async ngOnInit() {
    this.loadGerencias();
    this.loadSegmentos();
  }


  async loadGerencias() {
    try {
      const response = await this.gerenciaService.getPaginatedGerencias(1, 100);  
      this.gerencias = response.content.data;
      console.log('Gerencias cargadas:', this.gerencias);
    } catch (error) {
      console.error('Error al cargar gerencias:', error);
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
        console.log('Segmentos cargados:', this.segmentos);
      } else {
        console.error('No se encontraron datos en la respuesta:', response);
      }
    } catch (error) {
      console.error('Error al cargar segmentos:', error);
    }
  }
  
  guardarDatos() {
    const colaboradorModificado = {
      nombre: this.colaborador.nombre,
      gerencia: this.colaborador.gerencia,
      cargo: this.colaborador.cargo,
      celular: this.colaborador.celular,
      correo: this.colaborador.correo,
      segmento: this.colaborador.segmento,
      sede: this.colaborador.sede,
    };
    
    this.guardar.emit(colaboradorModificado);  
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
  }
}
