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
  imports: [ModificarGerenciaComponent, CommonModule, EliminarGerenciaComponent, NuevaGerenciaComponent, FormsModule],
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
  textSearch: any;
  allGerencias!: Gerencia[];

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
  }

  cargarListaGerencias() {
    this.gerenciaService.getPaginatedGerencias(this.currentPage, this.itemsPerPage).then((response: any) => {
  
      if (response && response.content && Array.isArray(response.content.data)) {
        this.gerencias = response.content.data.map((g: any) => ({
          ...g,
          fechaCreacion: new Date()  
        }));
        this.allGerencias = [...this.gerencias];
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

  search() {
    if(this.textSearch)
    {
      this.textSearch =  this.textSearch.toLowerCase()
      this.gerencias = this.allGerencias.filter(x => x.name?.toLowerCase().includes(this.textSearch))
    }
    else
      this.gerencias = [...this.allGerencias]

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

  async guardarNuevaGerencia(gerenciaCreada: { name: string }) {
    if (!gerenciaCreada || !gerenciaCreada.name.trim()) {
      console.error('El nombre de la gerencia no puede estar vacío.');
      alert('Por favor, ingresa un nombre válido para la gerencia.');
      return;
    }
  
    try {
      await this.gerenciaService.crearGerencia(gerenciaCreada.name);
      this.cargarListaGerencias();  
      this.cerrarModalNuevaGerencia();
    } catch (error) {
      console.error('Error al crear la gerencia:', error);
      alert('Ocurrió un error al crear la gerencia. Verifica los datos e inténtalo nuevamente.');
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
  
      try {
        await this.gerenciaService.modificarGerencia(gerenciaModificada as Required<Gerencia>); 
        this.cargarListaGerencias();
        this.cerrarModalModificar();
      } catch (error) {
        console.error('Error al modificar la gerencia:', error);
      }
    } else {
      console.error('ID de gerencia no válido para modificar');
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
}
