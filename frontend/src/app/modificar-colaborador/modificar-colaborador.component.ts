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
  foto!: File;
  rut: string = '';
  loading: boolean = false;

  constructor(
    private collaboratorService: CollaboratorService,
    private gerenciaService: GerenciaService,
    private segmentoService: SegmentService
  ) {}

  async ngOnInit() {
    if (!this.colaborador.rol) {
      console.error('El rol del colaborador no está definido.');
      this.colaborador.rol = ''; 
    }
    await this.loadGerencias();
    await this.loadSegmentos();
  }

  async loadGerencias() {
    try {
      const response = await this.gerenciaService.getPaginatedGerencias(1, 100);
      this.gerencias = response.content.data;
    } catch (error) {
      console.error('Error al cargar gerencias:', error);
    }
  }

  async loadSegmentos() {
    try {
      const response = await this.segmentoService.getPaginatedSegments(1, 100);  
  
      if (response && response.content && response.content.data) {
        this.segmentos = response.content.data
          .filter((item: any) => item.active) 
          .map((item: any) => ({
            id: item.id,
            nombreCompleto: item.name,  
            color: item.color,
            activo: item.active,
          }));
      } else {
        console.error('No se encontraron segmentos en la respuesta:', response);
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
  
    if (leadershipId === null || segmentId === null|| !this.colaborador.rol) {
      alert('Por favor, selecciona una gerencia, segmento y rol válidos.');
      return;
    }

    const colaboradorModificado = {
      Id: this.colaborador.id,
      CompleteName: this.colaborador.nombre,
      RUT: this.colaborador.rut,
      LeadershipId: leadershipId,
      SegmentId: segmentId,
      Position: this.colaborador.cargo,
      Sede: this.colaborador.sede || 'Sin Sede',
      Phone: this.colaborador.celular,
      Email: this.colaborador.correo,
      Role: this.colaborador.rol,
      ECollaboratorStatus: 1,
    };
  
  this.loading = true;
 this.collaboratorService.updateCollaborator(colaboradorModificado.Id, colaboradorModificado)
    .then(response => {
      if (this.foto) {
        this.subirArchivo(colaboradorModificado.Id, this.foto, 1).then(() => {
          this.collaboratorService.getCollaboratorById(colaboradorModificado.Id).then((updatedColaborador) => {
            this.colaborador = updatedColaborador.content;
            this.guardar.emit(this.colaborador);
            this.loading = false; 
          });
        });
      } else {
        this.guardar.emit(colaboradorModificado);
        this.loading = false;
      }
      this.cerrar.emit();
    })
    .catch(error => {
      console.error('Error al actualizar colaborador:', error);
      alert('Hubo un error al actualizar el colaborador.');
      this.loading = false;
    });
  }

  formatearRut() {
    let rutLimpio = this.rut.replace(/[^\dKk]/g, '');
  
    if (rutLimpio.length < 2) {
      this.rut = rutLimpio;
      return;
    }
  
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
  
    const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
    this.rut = `${cuerpoConPuntos}-${dv}`;
  }
  
  async subirArchivo(colaboradorId: number, archivo: File, tipo: number) {
    try {
      await this.collaboratorService.uploadAttachment(colaboradorId, archivo, tipo);
    } catch (error: any) {
      alert(`Hubo un error al subir el archivo de ${tipo}.`);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Solo se permiten archivos JPEG, JPG y PNG  ');
        return;
      }
  
      const maxSize = 10 * 1024 * 1024; // 10 MB
      if (file.size > maxSize) {
        alert('El archivo excede el tamaño máximo permitido de 10MB.');
        return;
      }
  
      this.foto = file;
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.colaborador.fotoPreview = e.target.result;
      };
      reader.readAsDataURL(this.foto);
    }
  }
  
}
