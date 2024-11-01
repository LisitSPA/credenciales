import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegmentService } from '../../services/segment.service';
import { EliminarComponent } from '../eliminar/eliminar.component';
import { NuevaSegmentoComponent } from '../nueva-segmento/nueva-segmento.component';
import { FormsModule } from '@angular/forms';

interface Segmento {
  id: number;
  nombreCompleto: string;
  color: string;
  activo: boolean;
  descripcion: string;
  seleccionado?: boolean;
}

@Component({
  selector: 'app-segmentos',
  standalone: true,
  imports: [CommonModule, EliminarComponent, NuevaSegmentoComponent, FormsModule],
  templateUrl: './segmentos.component.html',
  styleUrls: ['./segmentos.component.css'],
})
export class SegmentosComponent {
  segmentos: Segmento[] = []; 
  paginatedSegmentos: Segmento[] = []; 
  itemsPerPage = 7; 
  totalPages = 1;  
  mostrarModalNuevoSegmento: boolean = false;  
  mostrarModalEliminar: boolean = false;
  idSegmentoSeleccionado: number | null = null;
  currentPage = 1;  

  constructor(private segmentService: SegmentService) {
    this.cargarListaSegmentos(); 
  }

  get totalPagesCalculation() {
    return Math.ceil(this.segmentos.length / this.itemsPerPage);
  }

  cargarListaSegmentos() {
    this.segmentService.getPaginatedSegments(this.currentPage, this.itemsPerPage)
      .then((response: any) => {
        console.log('Respuesta obtenida del servicio:', response);
  
        if (response && response.content && response.content.data) {
          this.segmentos = response.content.data
            .filter((item: any) => item.active) 
            .map((item: any) => ({
              id: item.id,
              nombreCompleto: item.name,
              color: item.color,
              activo: item.active,
              seleccionado: false,
            }));
  
          console.log('Segmentos después de filtrar y mapear:', this.segmentos);
  
          this.totalPages = Math.ceil(response.content.totalCount / this.itemsPerPage);
          this.updatePaginatedSegmentos();  
          console.log('Segmentos obtenidos:', this.segmentos);
        } else {
          this.segmentos = [];
          console.error('Error: se esperaba un array de datos de segmentos.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener segmentos:', error);
        if (error.name === 'HttpErrorResponse' && error.status === 0) {
          alert('No se pudo conectar con el servidor. Por favor, verifique su conexión e inténtelo nuevamente.');
        } else {
          alert('Ocurrió un error al obtener los segmentos: ' + error.message);
        }
      });
  }
  
  transformColor(color: string): string {
    console.log('Transformando el color:', color);
  
    if (color && color.startsWith('#') && (color.length === 4 || color.length === 5)) {
      color = color + '0';
      console.log('Color transformado a:', color);
    } else {
      console.log('Color no necesita transformación o no cumple con las condiciones:', color);
    }
      return color;
  }
  

  isValidColor(color: string): boolean {
    console.log('Verificando si el color es válido:', color);

    const s = new Option().style;
    s.color = color;
    const isValid = s.color !== '';
    console.log('Resultado de la verificación del color:', isValid);
    return isValid;
  }

  updatePaginatedSegmentos() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedSegmentos = this.segmentos.slice(start, end);
    console.log('Lista paginada actualizada:', this.paginatedSegmentos);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedSegmentos();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedSegmentos();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedSegmentos();
  }

  pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  abrirModalNuevoSegmento() {
    this.mostrarModalNuevoSegmento = true;
  }

  cerrarModalNuevoSegmento() {
    this.mostrarModalNuevoSegmento = false;
  }

  abrirModalEliminar(id: number) {
    this.idSegmentoSeleccionado = id;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
  }

  async guardarNuevoSegmento(nuevoSegmento: { Description: string, Color: string }) {
    if (!nuevoSegmento.Description.trim() || !nuevoSegmento.Color.trim()) {
      console.error('El nombre o el color del segmento no pueden estar vacíos.');
      return;
    }

    try {
      await this.segmentService.createSegment(nuevoSegmento.Description, nuevoSegmento.Color);
      console.log('Segmento creado exitosamente');
      this.cargarListaSegmentos();  
      this.cerrarModalNuevoSegmento();  
    } catch (error) {
      console.error('Error al crear el segmento:', error);
    }
  }

  async eliminarSegmentoSeleccionado() {
    if (this.idSegmentoSeleccionado !== null) {
      try {
        await this.segmentService.deleteSegment(this.idSegmentoSeleccionado);
        console.log('Segmento eliminado exitosamente del backend');
        this.cargarListaSegmentos(); 
        this.cerrarModalEliminar(); 
      } catch (error) {
        console.error('Error al eliminar el segmento del backend:', error);
      }
    }
  }
  
  

 
}
