import { Component, Output, EventEmitter } from '@angular/core';  
import { SegmentService } from '../../services/segment.service';
import { GerenciaService } from '../../services/gerencia.service';  
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CollaboratorService } from '../../services/collaborators.service';

@Component({
  selector: 'app-nuevo-colaborador',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
      const response = await this.segmentoService.getPaginatedSegments(1, 100);  
      console.log('Respuesta completa del servicio de segmentos:', response);
  
      if (response && response.content && response.content.data) {
        this.segmentos = response.content.data
          .filter((item: any) => item.active) // Filtrar solo segmentos activos
          .map((item: any) => ({
            id: item.id,
            nombreCompleto: item.name,  
            color: item.color,
            activo: item.active,
          }));
        console.log('Segmentos después de filtrar y mapear:', this.segmentos);
      } else {
        console.error('No se encontraron segmentos en la respuesta:', response);
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

    const segmentoId = this.segmento ? Number(this.segmento) : null;
    if (segmentoId !== null && isNaN(segmentoId)) {
        console.error('El SegmentId no es un número válido.');
        alert('El segmento seleccionado no es válido. Por favor, selecciona un segmento válido.');
        return;
    }

    const segmentoExiste = segmentoId !== null && this.segmentos.some(segmento => segmento.id === segmentoId);
    if (segmentoId !== null && !segmentoExiste) {
        console.error('El SegmentId no existe en la lista de segmentos.');
        alert('El segmento seleccionado no es válido. Por favor, selecciona un segmento válido.');
        return;
    }

    const leadershipId = this.gerencia ? Number(this.gerencia) : null;
    if (leadershipId !== null && isNaN(leadershipId)) {
        console.error('El LeadershipId no es un número válido.');
        alert('La gerencia seleccionada no es válida. Por favor, selecciona una gerencia válida.');
        return;
    }

    this.sede = this.sede?.trim() ? this.sede : 'Sin Sede';

    console.log('Valor de Sede antes de enviar:', this.sede);
    console.log('Segmento seleccionado:', segmentoId);
    console.log('Gerencia seleccionada:', leadershipId);

    const nuevoColaborador: any = {
        CompleteName: this.nombre.trim(),
        RUT: this.rut ? this.rut.trim() : null,
        Position: this.cargo ? this.cargo.trim() : null,
        Area: this.sede,
        Phone: this.celular.trim(),
        Email: this.correo.trim(),
        ECollaboratorStatus: 1
    };

    if (this.foto) {
        nuevoColaborador.Photo = this.foto;
    }

    if (segmentoId !== null) {
        nuevoColaborador.SegmentId = segmentoId;
    }

    if (leadershipId !== null) {
        nuevoColaborador.LeadershipId = leadershipId;
    }

    try {
        console.log('Enviando colaborador al servidor:', nuevoColaborador);
        await this.collaboratorService.createCollaborator(nuevoColaborador);
        console.log('Colaborador creado con éxito.');
        this.colaboradorCreado.emit();
        this.cerrar.emit();
    } catch (error: any) {
        console.error('Error al crear colaborador:', error);
        if (error.message) {
            alert('Hubo un error al crear el colaborador: ' + error.message);
        } else {
            alert('Hubo un error al crear el colaborador.');
        }
    }
}

  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.foto = input.files[0];
    }
  }
}
