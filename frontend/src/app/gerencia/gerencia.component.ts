import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GerenciaService } from '../../services/gerencia.service';
import { EliminarGerenciaComponent } from '../eliminar-gerencia/eliminar-gerencia.component';
import { NuevaGerenciaComponent } from '../nueva-gerencia/nueva-gerencia.component';
import { FormsModule } from '@angular/forms';
import { ModificarGerenciaComponent } from '../modificar-gerencia/modificar-gerencia.component';

interface Gerencia {
  id: number;
  name: string;
  active: boolean;
  fechaCreacion?: Date;
}

@Component({
  selector: 'app-gerencia',
  standalone: true,
  imports: [ModificarGerenciaComponent,CommonModule, EliminarGerenciaComponent, NuevaGerenciaComponent, FormsModule],
  templateUrl: './gerencia.component.html',
  styleUrls: ['./gerencia.component.css']
})
export class GerenciasComponent {
  gerencias: Gerencia[] = [];  
  paginatedGerencias: Gerencia[] = [];  
  currentPage = 1;  
  itemsPerPage = 7;  
  selectedFile: File | null = null;  

  gerenciaSeleccionada: Gerencia | null = null; 
  mostrarModalNuevaGerencia: boolean = false;  
  mostrarModalModificar: boolean = false;  
  mostrarModalEliminar: boolean = false;

  constructor(private gerenciaService: GerenciaService) {
    this.cargarListaGerencias(); 
  }

  get totalPages() {
    return Math.ceil(this.gerencias.length / this.itemsPerPage);  
  }

  updatePaginatedGerencias() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedGerencias = this.gerencias.slice(start, end); 
    console.log('Gerencias paginadas:', this.paginatedGerencias);  
  }
  

  cargarListaGerencias() {
    this.gerenciaService.getPaginatedGerencias(this.currentPage, this.itemsPerPage).then((response: any) => {
      console.log('Respuesta completa de la API:', response); 
  
      if (response && response.content && Array.isArray(response.content.data)) {
        this.gerencias = response.content.data.map((g: any) => ({
          ...g,
          fechaCreacion: new Date()  
        }));
        console.log('Gerencias cargadas:', this.gerencias);
      } else {
        console.error('No se encontraron datos en la respuesta de la API');
        this.gerencias = [];
      }
  
      this.updatePaginatedGerencias();  
    }).catch((error: any) => {
      console.error('Error al obtener las gerencias:', error);
      if (error.name === 'HttpErrorResponse' && error.status === 0) {
        alert('No se pudo conectar con el servidor. Por favor, verifique su conexión e inténtelo nuevamente.');
      } else {
        alert('Ocurrió un error al obtener las gerencias: ' + error.message);
      }
    });
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

  pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedGerencias();
  }

  abrirModalNuevaGerencia() {
    this.mostrarModalNuevaGerencia = true;
  }

  cerrarModalNuevaGerencia() {
    this.mostrarModalNuevaGerencia = false;
  }
  async guardarNuevaGerencia({ name, active }: { name: string, active: boolean }) {
    if (!name.trim()) {
      console.error('El nombre de la gerencia no puede estar vacío.');
      return;
    }
  
    try {
      await this.gerenciaService.crearGerencia(name, active);  
      console.log('Gerencia creada exitosamente con estado:', active);
      this.cargarListaGerencias();  
      this.cerrarModalNuevaGerencia();
    } catch (error) {
      console.error('Error al crear la gerencia:', error);
    }
  }
  


  abrirModalModificar(gerencia: { id: number; name: string; active: boolean }) {
    this.gerenciaSeleccionada = { ...gerencia };  
    this.mostrarModalModificar = true;  
  }

  cerrarModalModificar() {
    this.mostrarModalModificar = false; 
  }

  async guardarModificacionGerencia(gerenciaModificada: Gerencia) {
    if (gerenciaModificada) {
      console.log('Guardando cambios en la gerencia:', gerenciaModificada);

      try {
        await this.gerenciaService.modificarGerencia(gerenciaModificada);
        console.log('Gerencia modificada exitosamente');
        this.cargarListaGerencias(); 
        this.cerrarModalModificar(); 
      } catch (error) {
        console.error('Error al modificar la gerencia:', error);
      }
    }
  }

  seleccionarGerencia(id: number) {
    this.gerenciaSeleccionada = this.gerencias.find(g => g.id === id) || null;
    console.log('Gerencia seleccionada con ID:', id);
  }

  abrirModalEliminar() {
    if (this.gerenciaSeleccionada !== null) {
      this.mostrarModalEliminar = true;
    } else {
      alert('Por favor selecciona una gerencia para eliminar.');
    }
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
  }

  async eliminarGerenciaConfirmada() {
    if (this.gerenciaSeleccionada !== null) {
      try {
        await this.gerenciaService.eliminarGerencia(this.gerenciaSeleccionada.id);
        console.log('Gerencia eliminada exitosamente');
        this.cargarListaGerencias();
        this.cerrarModalEliminar();
      } catch (error) {
        console.error('Error al eliminar la gerencia:', error);
      }
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
}
