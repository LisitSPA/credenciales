import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GerenciaService } from '../../services/gerencia.service';
import { EliminarGerenciaComponent } from '../eliminar-gerencia/eliminar-gerencia.component';
import { NuevaGerenciaComponent } from '../nueva-gerencia/nueva-gerencia.component';
import { FormsModule } from '@angular/forms';
import { ModificarGerenciaComponent } from '../modificar-gerencia/modificar-gerencia.component';
import { SpinnerService } from '../../services/spinner.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';

interface Gerencia {
  id: number;
  name: string;
  active: boolean;
  fechaCreacion?: Date;
}

@Component({
  selector: 'app-gerencia',
  standalone: true,
  imports: [ModificarGerenciaComponent, CommonModule, EliminarGerenciaComponent, NuevaGerenciaComponent, FormsModule],
  templateUrl: './gerencia.component.html',
  styleUrls: ['./gerencia.component.css']
})
export class GerenciasComponent implements OnInit, OnDestroy {

  gerencias: Gerencia[] = [];  
  paginatedGerencias: Gerencia[] = [];  
  currentPage = 1;  
  itemsPerPage = 10;  
  selectedFile: File | null = null;  
  filteredGerencias: Gerencia[] = [];
  gerenciaSeleccionada: Gerencia | null = null; 
  mostrarModalNuevaGerencia: boolean = false;  
  mostrarModalModificar: boolean = false;  
  mostrarModalEliminar: boolean = false;
  textSearch: string = '';
  allGerencias: Gerencia[] = [];
  private inactivityTimeout: any;
  private readonly INACTIVITY_TIME = 900000;
  loading: boolean = false;

  constructor(
    private gerenciaService: GerenciaService, 
    private spinnerService: SpinnerService,
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2,
  ) {
    this.cargarListaGerencias(); 
  }

  get totalPages() {
    return Math.ceil(this.filteredGerencias.length / this.itemsPerPage);  
  }

  ngOnInit() {
    this.resetInactivityTimeout();
    this.addUserInteractionListeners();
  }
  
  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredGerencias.length);
    return `${start} a ${end}`;
  }
  
  cargarListaGerencias() {
    this.loading = true;
    this.gerenciaService.getPaginatedGerencias(this.currentPage, this.itemsPerPage).then((response: any) => {
      if (response && response.content && Array.isArray(response.content.data)) {
        this.allGerencias = response.content.data.map((g: any) => ({
          ...g,
          fechaCreacion: new Date(),
        }));
        this.filteredGerencias = [...this.allGerencias];
        this.updatePaginatedGerencias();
      } else {
        console.error('No se encontraron datos en la respuesta de la API');
        this.allGerencias = [];
        this.filteredGerencias = [];
        this.paginatedGerencias = [];
      }
      setTimeout(() => this.loading = false, 1200);
    }).catch((error: any) => {
      console.error('Error al obtener las gerencias:', error);
      this.allGerencias = [];
      this.filteredGerencias = [];
      this.paginatedGerencias = [];
      setTimeout(() => this.loading = false, 1200);
    });
  }

  search() {
    if (this.textSearch) {
      const searchText = this.textSearch.toLowerCase();
      this.filteredGerencias = this.allGerencias.filter((x) =>
        x.name?.toLowerCase().includes(searchText)
      );
    } else {
      this.filteredGerencias = [...this.allGerencias];
    }
    this.currentPage = 1; 
    this.updatePaginatedGerencias();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedGerencias();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedGerencias();
    }
  }

  updatePaginatedGerencias() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedGerencias = this.filteredGerencias.slice(start, end);
  }
  
  updateItemsPerPage() {
    this.itemsPerPage = +this.itemsPerPage; 
    this.currentPage = 1; 
    this.updatePaginatedGerencias(); 
  }
  
  pages() {
    const totalPages = this.totalPages; 
    const current = this.currentPage; 
    const delta = 2; 
    const pages: (number | string)[] = []; 
    
    if (current > 1 + delta) {
      pages.push(1);
      if (current > 2 + delta) {
        pages.push('...');
      }
    }
  
    for (let i = Math.max(1, current - delta); i <= Math.min(totalPages, current + delta); i++) {
      pages.push(i);
    }
  
    if (current < totalPages - delta) {
      if (current < totalPages - delta - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
  
    return pages;
  }
  
  goToPage(page: number | string) {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.updatePaginatedGerencias();
    }
  }

  abrirModalNuevaGerencia() {
    this.mostrarModalNuevaGerencia = true;
  }

  cerrarModalNuevaGerencia() {
    this.mostrarModalNuevaGerencia = false;
  }

  async guardarNuevaGerencia(gerenciaCreada: { name: string }) {
    if (!gerenciaCreada || !gerenciaCreada.name.trim()) {
      console.error('El nombre de la gerencia no puede estar vacío.');
      alert('Por favor, ingresa un nombre válido para la gerencia.');
      return;
    }

    this.loading = true;
    try {
      await this.gerenciaService.crearGerencia(gerenciaCreada.name);
      this.cargarListaGerencias();  
      this.cerrarModalNuevaGerencia();
     setTimeout(() => this.loading = false, 1200); 
    } catch (error) {
      console.error('Error al crear la gerencia:', error);
      alert('Ocurrió un error al crear la gerencia. Verifica los datos e inténtalo nuevamente.');
     setTimeout(() => this.loading = false, 1200); 
    }
  }
  
  abrirModalModificar(gerencia: Gerencia) {
    if (gerencia.id !== undefined) {
      this.gerenciaSeleccionada = { ...gerencia };
      this.mostrarModalModificar = true;
    } else {
      console.error('No se puede abrir el modal de modificar: ID no válido');
    }
  }
  
  cerrarModalModificar() {
    this.mostrarModalModificar = false; 
  }

  async guardarModificacionGerencia(gerenciaModificada: Gerencia) {
    if (gerenciaModificada && gerenciaModificada.id !== undefined) {
      this.loading = true;
      try {
        await this.gerenciaService.modificarGerencia(gerenciaModificada as Required<Gerencia>); 
        this.cargarListaGerencias();
        this.cerrarModalModificar();
        setTimeout(() => this.loading = false, 1200); 
      } catch (error) {
        console.error('Error al modificar la gerencia:', error);
        setTimeout(() => this.loading = false, 1200); 
      }
    } else {
      console.error('ID de gerencia no válido para modificar');
      setTimeout(() => this.loading = false, 1200); 
    }
  }
  

  // seleccionarGerencia(id: number | undefined) {
  //   if (id === undefined) {
  //     console.error('ID de gerencia no válido');
  //     return;
  //   }
  //   this.gerenciaSeleccionada = this.gerencias.find(g => g.id === id) || null;
  // }
  
  abrirModalEliminar(gerencia: any) {
    this.gerenciaSeleccionada = gerencia;
      this.mostrarModalEliminar = true;
   
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
  }

  async eliminarGerenciaConfirmada() {
    if (this.gerenciaSeleccionada?.id !== undefined) {
      try {
        await this.gerenciaService.eliminarGerencia(this.gerenciaSeleccionada.id);
        this.cargarListaGerencias();
        this.cerrarModalEliminar();
      } catch (error) {
        console.error('Error al eliminar la gerencia:', error);
      }
    } else {
      console.error('ID de gerencia no válido para eliminar');
    }
  }
  

  async cargarGerencias() {
    if (this.selectedFile) {
      try {
        await this.gerenciaService.uploadMissiveGerencia(this.selectedFile);
        this.cargarListaGerencias();
      } catch (error) {
        console.error('Error al cargar gerencias:', error);
      }
    }
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
