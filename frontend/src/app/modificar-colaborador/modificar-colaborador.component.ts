import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CollaboratorService } from '../../services/collaborators.service';
import { SegmentService } from '../../services/segment.service';
import { GerenciaService } from '../../services/gerencia.service';  
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modificar-colaborador',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
    await this.loadGerencias();
    await this.loadSegmentos();
  }

  async loadGerencias() {
    try {
      const response = await this.gerenciaService.getPaginatedGerencias(1, 100);
      this.gerencias = response.content.data.filter((gerencia: any) => gerencia.active);
    } catch (error) {
      console.error('Error al cargar gerencias:', error);
    }
  }

  async loadSegmentos() {
    try {
      const response = await this.segmentoService.getPaginatedSegments(1, 100);
      if (response && response.content && response.content.data) {
        this.segmentos = response.content.data.filter((segment: any) => segment.active);
      } else {
        console.error('No se encontraron segmentos activos en la respuesta:', response);
      }
    } catch (error) {
      console.error('Error al cargar segmentos:', error);
    }
  }

  guardarDatos() {
    if (!this.colaborador) {
      console.error('No hay colaborador para modificar.');
      return;
    }
  
    const leadershipId = this.colaborador.gerencia ? Number(this.colaborador.gerencia) : null;
    const segmentId = this.colaborador.segmento ? Number(this.colaborador.segmento) : null;
  
    if (leadershipId === null || segmentId === null) {
      alert('Por favor, selecciona una gerencia y un segmento válidos.');
      return;
    }
  
    const colaboradorModificado = {
      Id: this.colaborador.id,
      CompleteName: this.colaborador.nombre,
      LeadershipId: leadershipId,
      SegmentId: segmentId,
      Position: this.colaborador.cargo,
      Sede: this.colaborador.sede || 'Sin Sede',
      Phone: this.colaborador.celular,
      Email: this.colaborador.correo,
      ECollaboratorStatus: 1,
    };
  
  
    this.collaboratorService.updateCollaborator(colaboradorModificado.Id, colaboradorModificado)
      .then(response => {
        this.guardar.emit(colaboradorModificado);  
      })
      .catch(error => {
        console.error('Error al actualizar colaborador:', error);
        alert('Hubo un error al actualizar el colaborador.');
      });
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
    }
  }
}
