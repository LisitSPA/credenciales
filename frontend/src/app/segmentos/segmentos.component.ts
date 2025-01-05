import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegmentService } from '../../services/segment.service';
import { EliminarComponent } from '../eliminar/eliminar.component';
import { NuevaSegmentoComponent } from '../nueva-segmento/nueva-segmento.component';
import { FormsModule } from '@angular/forms';
import { ModificarSegmentoComponent } from '../modificar-segmento/modificar-segmento.component';

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
  imports: [CommonModule, EliminarComponent, NuevaSegmentoComponent, FormsModule, ModificarSegmentoComponent],
  templateUrl: './segmentos.component.html',
  styleUrls: ['./segmentos.component.css'],
})
export class SegmentosComponent {
  segmentos: Segmento[] = []; 
  paginatedSegmentos: Segmento[] = []; 
  itemsPerPage = 4; 
  totalPages = 1;  
  mostrarModalNuevoSegmento: boolean = false;  
  mostrarModalEliminar: boolean = false;
  idSegmentoSeleccionado: number | null = null;
  segmentoSeleccionado: Segmento | null = null; 
  currentPage = 1;
  fixedPages: number[] = [1, 2, 3, 4, 5]; 
  mostrarModificar: boolean = false;
  textSearch: any;
  allSegmentos: Segmento[] = []; 

  constructor(private segmentService: SegmentService) {
    this.cargarListaSegmentos(); 
  }


  cargarListaSegmentos() {
    this.segmentService.getPaginatedSegments(this.currentPage, this.itemsPerPage)
      .then((response: any) => {
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
          this.totalPages = Math.ceil(response.content.totalCount / this.itemsPerPage);
          this.updatePaginatedSegmentos();
        } else {
          this.segmentos = [];
          console.error('Error: No se encontraron datos de segmentos.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener segmentos:', error);
        alert('Ocurrió un error al obtener los segmentos.');
      });
  }
  
  search() {
    if(this.textSearch)
    {
      this.textSearch =  this.textSearch.toLowerCase()
      this.segmentos = this.allSegmentos.filter(x => x.nombreCompleto?.toLowerCase().includes(this.textSearch))
    }
    else
      this.segmentos = [...this.allSegmentos]

    this.updatePaginatedSegmentos();  
  }

  transformColor(color: string): string {
    if (color && color.startsWith('#') && (color.length === 4 || color.length === 5)) {
      color = color + '0';
    } 
    return color;
  }
  

  isValidColor(color: string): boolean {

    const s = new Option().style;
    s.color = color;
    const isValid = s.color !== '';
    return isValid;
  }

  get totalPagesCalculation() {
    return Math.ceil(this.segmentos.length / this.itemsPerPage);
  }
  
  updatePaginatedSegmentos() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedSegmentos = this.segmentos.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedSegmentos();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPagesCalculated) {
      this.currentPage++;
      this.updatePaginatedSegmentos();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedSegmentos();
  }
  get totalPagesCalculated() {
    return Math.ceil(this.segmentos.length / this.itemsPerPage);  
  }
  changeItemsPerPage() {
    this.currentPage = 1;  
    this.updatePaginatedSegmentos();  
  }
  
  generatePageNumbers() {
    return Array.from({ length: this.totalPagesCalculated }, (_, i) => i + 1);
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
        this.cargarListaSegmentos(); 
        this.cerrarModalEliminar(); 
      } catch (error) {
        console.error('Error al eliminar el segmento del backend:', error);
      }
    }
  }
  
  guardarModificaciones(segmentoModificado: Segmento) {
    if (segmentoModificado && segmentoModificado.id) {
      this.segmentService.updateSegment(segmentoModificado.id, segmentoModificado.nombreCompleto, segmentoModificado.color, segmentoModificado.activo)
        .then(response => {
          this.cargarListaSegmentos(); 
          this.cerrarFormulario(); 
        })
        .catch(error => {
          if (error.status === 400 && error.error && error.error.message) {
            alert('Error: ' + error.error.message);
          } else {
            alert('Error al modificar segmento: ' + error.message);
          }
        });
    }
  }
  
  abrirFormularioModificar(segmento: Segmento) {
    if (segmento && segmento.id) {
      this.segmentoSeleccionado = segmento; 
      this.mostrarModificar = true; 
    } else {
      console.error('El segmento seleccionado no es válido:', segmento);
    }
  }
  
  
  cerrarFormulario() {
    this.mostrarModificar = false;
  }
}
