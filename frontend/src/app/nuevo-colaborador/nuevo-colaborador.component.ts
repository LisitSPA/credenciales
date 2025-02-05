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
  sede: string = 'Sin Sede';  
  foto!: File;
  firma: File | null = null;
  credencial: File | null = null;
  password: string = ''; 
  rol: string = 'Colaborador';

  gerencias: any[] = [];  
  segmentos: any[] = [];  

  adjuntarFirma: boolean = false;
  adjuntarCredencial: boolean = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() colaboradorCreado = new EventEmitter<void>();
file: any;

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

  async guardarDatos() {
    if (!this.nombre || !this.celular || !this.correo|| !this.password || !this.rol) {
      alert('Por favor, rellena los campos obligatorios.');
      return;
    }
  
    const segmentoId = this.segmento ? Number(this.segmento) : null;
    const leadershipId = this.gerencia ? Number(this.gerencia) : null;
  
    this.sede = this.sede.trim() ? this.sede : 'Sin Sede'; 
  
    const nuevoColaborador: any = {
      CompleteName: this.nombre,
      RUT: this.rut,
      Position: this.cargo,
      Phone: this.celular,
      Email: this.correo,
      Password: this.password,
      Role: this.rol,
      ECollaboratorStatus: 1,
      LeadershipId: leadershipId,
      SegmentId: segmentoId,
      Sede: this.sede
    };
  
    try {
      const response = await this.collaboratorService.createCollaborator(nuevoColaborador);
      const colaboradorId = response.content;            
  
      if (colaboradorId) {
  
          if (this.foto) {
              await this.subirArchivo(colaboradorId, this.foto, 1);
          }
  
          // if (this.adjuntarFirma && this.firma) {
          //     await this.subirArchivo(colaboradorId, this.firma, 'Signature');
          // }
  
          // if (this.adjuntarCredencial && this.credencial) {
          //     await this.subirArchivo(colaboradorId, this.credencial, 'Credential');
          // }
  
          this.colaboradorCreado.emit();
          this.cerrar.emit();
      } else {
          console.error('El ID del colaborador no se encontró en la respuesta:', response);
          alert('Hubo un error al crear el colaborador. No se pudo obtener el ID.');
      }
  } catch (error: any) {
      console.error('Error al crear colaborador:', error);
      alert('Hubo un error al crear el colaborador.');
  }
  
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
      console.error(`Error al subir ${tipo}:`, error);
      alert(`Hubo un error al subir el archivo de ${tipo}.`);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // if (this.adjuntarFirma) {
      //   this.firma = input.files[0];
      // } else if (this.adjuntarCredencial) {
      //   this.credencial = input.files[0];
      // } else {
        this.foto = input.files[0];
      
    }
  }

  onCheckboxChange() {
    if (!this.adjuntarFirma) {
      this.firma = null;
    }
    if (!this.adjuntarCredencial) {
      this.credencial = null;
    }
  }
}
