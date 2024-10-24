import { Component, Output, EventEmitter } from '@angular/core';  
import { SegmentService } from '../../services/segment.service';
import { GerenciaService } from '../../services/gerencia.service';  
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CollaboratorService } from '../../services/collaborators.service';

@Component({
  selector: 'app-nuevo-colaborador',
  standalone: true,
  imports: [FormsModule, CommonModule,],
  templateUrl: './nuevo-colaborador.component.html',
  styleUrls: ['./nuevo-colaborador.component.css']
})
export class NuevoColaboradorComponent {
  nombre: string = '';
  rut: string = '';
  gerencia: string = '';
  cargo: string = '';
  segmento: string = '';
  celular: string = '';
  correo: string = '';
  sede: string = '';
  foto: File | null = null;

  gerencias: any[] = [];  
  segmentos: any[] = [];  

  @Output() cerrar = new EventEmitter<void>();
  @Output() colaboradorCreado = new EventEmitter<void>();

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
  

  async guardarDatos() {
    if (!this.nombre || !this.celular || !this.correo) {
      alert('Por favor, rellena los campos obligatorios.');
      return;
    }

    const nuevoColaborador = {
      CompleteName: this.nombre,
      RUT: this.rut,
      LeadershipId: this.gerencia,  
      SegmentId: this.segmento, 
      Position: this.cargo,
      Sede: this.sede,
      Phone: this.celular,
      Email: this.correo,
      ECollaboratorStatus: 1, 
      Photo: this.foto
    };

    try {
      await this.collaboratorService.createCollaborator(nuevoColaborador);
      this.colaboradorCreado.emit(); 
      this.cerrar.emit(); 
    } catch (error) {
      console.error('Error al crear colaborador:', error);
      alert('Hubo un error al crear el colaborador.');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.foto = input.files[0];
    }
  }
}
