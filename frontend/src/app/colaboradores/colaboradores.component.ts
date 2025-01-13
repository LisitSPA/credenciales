import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevoColaboradorComponent } from '../nuevo-colaborador/nuevo-colaborador.component';
import { EliminarComponent } from '../eliminar/eliminar.component';
import { ModificarColaboradorComponent } from '../modificar-colaborador/modificar-colaborador.component';
import { Router } from '@angular/router';
import { CollaboratorService } from '../../services/collaborators.service';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';

interface Colaborador {
  id: number;
  nombre: string;
  rut: string;
  segmento: string;
  nombreSegmento: string;
  gerencia: string;
  nombreGerencia: string;
  cargo: string;
  celular: string;
  correo: string;
  estado: string;
  tieneFoto?: boolean;
  tieneFirma?: boolean;
  tieneCredencial?: boolean;
  sede: string;
}

@Component({
  selector: 'app-colaboradores',
  standalone: true,
  imports: [ModificarColaboradorComponent, CommonModule, NuevoColaboradorComponent, EliminarComponent, FormsModule],
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.css']
})
export class ColaboradoresComponent {

  colaboradores: Colaborador[] = [];
  selectedColaboradores: Colaborador[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  selectedColaborador: Colaborador | null = null;
  mostrarFormulario: boolean = false;
  mostrarModificar: boolean = false;
  mostrarModalEliminarFlag: boolean = false;
  textSearch: any;
  allColaboradores: Colaborador[] = [];
  paginatedColaboradores: Colaborador[] = [];
  filteredColaboradores: Colaborador[] = [];


  constructor(private collaboratorService: CollaboratorService, private router: Router) {
    this.cargarListaColaboradores();
  }


  cargarListaColaboradores() {
    this.collaboratorService.getPaginatedCollaborators(this.currentPage, this.itemsPerPage)
      .then(response => {
        if (response && response.content && response.content.data) {
          this.allColaboradores = response.content.data.map((item: any) => ({
            id: item.id,
            nombre: item.completeName,
            rut: item.rut,
            segmento: item.segmentId,
            nombreSegmento: item.segment,
            gerencia: item.leadershipId,
            nombreGerencia: item.leadership,
            cargo: item.position,
            celular: item.phone,
            correo: item.email,
            estado: item.status,
            tieneFoto: item.hasPhoto,
            tieneFirma: item.hasSignature,
            tieneCredencial: item.hasCredential,
            sede: item.area
          }));
          
          this.filteredColaboradores = [...this.allColaboradores];
          this.updatePaginatedColaboradores();
        }
      })
      .catch(error => {
        console.error('Error al obtener colaboradores:', error);
      });
  }
  
  updatePaginatedColaboradores() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedColaboradores = this.filteredColaboradores.slice(start, end);  
  }
  
  search() {
    if (this.textSearch) {
      const searchText = this.textSearch.toLowerCase();

      this.filteredColaboradores = this.allColaboradores.filter(x =>
        x.nombre?.toLowerCase().includes(searchText) ||
        x.rut?.includes(searchText) ||
        x.correo?.toLowerCase().includes(searchText)
      );
    } else {
      this.filteredColaboradores = [...this.allColaboradores];
    }
      this.updatePaginatedColaboradores();
  }

  toggleSelection(colaborador: Colaborador, event: any) {
    if (event.target.checked) {
      this.selectedColaboradores.push(colaborador);
    } else {
      this.selectedColaboradores = this.selectedColaboradores.filter(c => c.id !== colaborador.id);
    }
  }

  onReimprimir() {
    if (this.selectedColaboradores.length === 0) {
      alert('Por favor, selecciona al menos un colaborador.');
      return;
    }

    localStorage.setItem('print', JSON.stringify(this.selectedColaboradores[0]));
    this.router.navigate(['/generar']);
  }

  nextPage() {
    if (this.currentPage < this.totalPagesCalculated) {
      this.currentPage++;
      this.updatePaginatedColaboradores();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedColaboradores();
    }
  }

  pages() {
    return Array.from({ length: this.totalPagesCalculated }, (_, i) => i + 1);
  }

  changeItemsPerPage() {
    this.currentPage = 1;  
    this.updatePaginatedColaboradores();  
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPagesCalculated) {
      this.currentPage = page;
      this.updatePaginatedColaboradores();
    }
  }

  get totalPagesCalculated() {
    return Math.ceil(this.allColaboradores.length / this.itemsPerPage); 
  }
  onColaboradorModificado(colaboradorModificado: Colaborador) {
    this.cargarListaColaboradores();
  }
  

  abrirFormulario() {
    this.selectedColaborador = null;
    this.mostrarFormulario = true;
    this.mostrarModificar = false;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.mostrarModificar = false;
  }

  mostrarModalEliminar(colaborador: Colaborador) {
    this.selectedColaborador = colaborador;
    this.mostrarModalEliminarFlag = true;
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminarFlag = false;
    this.selectedColaborador = null;
  }

  eliminarColaborador() {
    if (this.selectedColaborador) {
      this.collaboratorService.deleteCollaborator(this.selectedColaborador.id).then(response => {
        if (response && response.statusCode === 200) {
          this.cargarListaColaboradores();
          this.cerrarModalEliminar(); 
        } else {
        }
      }).catch(error => {
        alert('Error al eliminar colaborador: ' + error.message);
      });
    }
  }
  

  editar(colaborador: Colaborador) {
    this.selectedColaborador = colaborador;
    this.mostrarModificar = true;
    this.mostrarFormulario = false; 
  }
  cerrarModificar() {
    this.mostrarModificar = false;
    this.selectedColaborador = null;
  }

  guardarModificaciones(colaboradorModificado: Colaborador) {
    if (colaboradorModificado && colaboradorModificado.id) {
      this.collaboratorService.updateCollaborator(colaboradorModificado.id, colaboradorModificado)
        .then(response => {
          this.updatePaginatedColaboradores();  
          this.mostrarModificar = false;
        })
        .catch(error => {
          if (error.status === 400 && error.error && error.error.message) {
            alert('Error: ' + error.error.message);  
          } else {
            alert('Error al modificar colaborador: ' + error.message);  
          }
        });
    }
  }

  onColaboradorCreado() {
    this.cargarListaColaboradores(); 
    this.cerrarFormulario();  

  } 

  redirigirFirmaExitosa(colaborador: Colaborador) {
    this.router.navigate(['/firmaexitosa', colaborador.id]); 
  }

  redirigirCredencialExitosa(colaborador: Colaborador) {
    this.router.navigate(['/credencialexitosa', colaborador.id]);
  }

  descargarArchivo(colaboradorId: number, tipoArchivo: number) {
    this.collaboratorService.getAttachment(colaboradorId, tipoArchivo)
      .then(response => {
        const blob = new Blob([response], { type: response.type });
        const url = window.URL.createObjectURL(blob);

        const newWindow = window.open(url);
        if (newWindow) {
          newWindow.onload = () => {
            newWindow.location.href = url;
          };
        } else {
          console.error('No se pudo abrir una nueva ventana. Probablemente esté bloqueada por el navegador.');
        }

        saveAs(blob, `${tipoArchivo}_${colaboradorId}.pdf`); 
      })
      .catch(error => {
        console.error(`Error al descargar el archivo ${tipoArchivo} para el colaborador con ID ${colaboradorId}:`, error);
        alert(`Hubo un error al descargar el archivo de ${tipoArchivo}.`);
      });
  }

}