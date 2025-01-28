import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegmentService } from '../../services/segment.service';
import { EliminarComponent } from '../eliminar/eliminar.component';
import { NuevaSegmentoComponent } from '../nueva-segmento/nueva-segmento.component';
import { FormsModule } from '@angular/forms';
import { ModificarSegmentoComponent } from '../modificar-segmento/modificar-segmento.component';
import { SpinnerService } from '../../services/spinner.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';

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
  itemsPerPage = 7; 
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
  canSeeHome: boolean = false;

  private inactivityTimeout: any;
  private readonly INACTIVITY_TIME = 900000;

  constructor(
    private segmentService: SegmentService, 
    public spinnerService: SpinnerService,
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2,
  
  ) {
    this.cargarListaSegmentos(); 
  }

  ngOnInit() {
    this.resetInactivityTimeout();
    this.addUserInteractionListeners();
  }

  cargarListaSegmentos() {
    this.spinnerService.showSpinner();

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
        setTimeout(() => this.spinnerService.hideSpinner(), 1200); 
      })
      .catch((error) => {
        console.error('Error al obtener segmentos:', error);
        alert('Ocurrió un error al obtener los segmentos.');
        setTimeout(() => this.spinnerService.hideSpinner(), 1200); 
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

  goToPage(page: number | string) {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.updatePaginatedSegmentos(); // Actualiza los datos de la tabla
    }
  }


  
  get totalPagesCalculated() {
    return Math.ceil(this.segmentos.length / this.itemsPerPage);  
  }

  changeItemsPerPage() {
    this.itemsPerPage = +this.itemsPerPage; 
    this.currentPage = 1; 
    this.updatePaginatedSegmentos(); 
  }

  pages() {
    const totalPages = this.totalPagesCalculated;
    const current = this.currentPage;
    const delta = 2;
    const range: (number | string)[] = [];
  
    if (current > 1 + delta) {
      range.push(1);
      if (current > 2 + delta) {
        range.push('...');
      }
    }
  
    for (let i = Math.max(1, current - delta); i <= Math.min(totalPages, current + delta); i++) {
      range.push(i);
    }
  
    if (current < totalPages - delta) {
      if (current < totalPages - delta - 1) {
        range.push('...');
      }
      range.push(totalPages);
    }
  
    return range;
  }
  
  

  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.segmentos.length);
    return `${start} a ${end}`;
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
    this.spinnerService.showSpinner();
    
    try {
      const creado = await this.segmentService.createSegment(nuevoSegmento.Description, nuevoSegmento.Color);
      const nuevoSegmentoCreado = {
        id: creado.id, 
        nombreCompleto: nuevoSegmento.Description,
        color: nuevoSegmento.Color,
        activo: true,
        seleccionado: false,
        descripcion: nuevoSegmento.Description 
        
      };
  
      this.segmentos.unshift(nuevoSegmentoCreado); 
      this.updatePaginatedSegmentos(); 
  
      alert('Segmento creado exitosamente.');
      setTimeout(() => this.spinnerService.hideSpinner(), 1200);
    } catch (error) {
      alert('Segmento duplicado');
      setTimeout(() => this.spinnerService.hideSpinner(), 1200);
    }
  }

  async eliminarSegmentoSeleccionado() {
    if (this.idSegmentoSeleccionado !== null) {
      this.spinnerService.showSpinner();

      try {
        await this.segmentService.deleteSegment(this.idSegmentoSeleccionado);
        this.cargarListaSegmentos(); 
        this.cerrarModalEliminar(); 
        setTimeout(() => this.spinnerService.hideSpinner(), 1200);
      } catch (error) {
        console.error('Error al eliminar el segmento del backend:', error);
        setTimeout(() => this.spinnerService.hideSpinner(), 1200);
      }
    }
  }
  
  guardarModificaciones(segmentoModificado: Segmento) {
    if (segmentoModificado && segmentoModificado.id) {
      this.spinnerService.showSpinner();

      this.segmentService.updateSegment(segmentoModificado.id, segmentoModificado.nombreCompleto, segmentoModificado.color, segmentoModificado.activo)
        .then(response => {
          this.cargarListaSegmentos(); 
          this.cerrarFormulario(); 
          setTimeout(() => this.spinnerService.hideSpinner(), 1200);
        })
        .catch(error => {
          if (error.status === 400 && error.error && error.error.message) {
            alert('Error: ' + error.error.message);
          } else {
            alert('Error al modificar segmento: ' + error.message);
            setTimeout(() => this.spinnerService.hideSpinner(), 1200);
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

  logout() {
    this.authService.logout();  
  }

  private isOnLoginPage(): boolean {
    const loginPaths = ['/', '/login'];
    return loginPaths.includes(window.location.pathname);
  }
  

  private handleInactivity() {
    if (!this.isOnLoginPage()) {
      alert('Su sesión ha expirado por inactividad.');
      this.logout();
    }
  }
  
  
  private resetInactivityTimeout() {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
    this.inactivityTimeout = setTimeout(() => this.handleInactivity(), this.INACTIVITY_TIME);
  }

  private addUserInteractionListeners() {
    this.renderer.listen('window', 'mousemove', () => {
      this.resetInactivityTimeout();
    });
    this.renderer.listen('window', 'keydown', (event: KeyboardEvent) => {
      this.resetInactivityTimeout();
    });
    this.renderer.listen('window', 'scroll', () => {
      this.resetInactivityTimeout();
    });
  }
  
  ngOnDestroy() {
    clearTimeout(this.inactivityTimeout);
    window.removeEventListener('mousemove', () => this.resetInactivityTimeout());
    window.removeEventListener('keydown', () => this.resetInactivityTimeout());
  }
}
