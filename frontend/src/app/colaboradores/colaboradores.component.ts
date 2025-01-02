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
  gerencia: string;
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
  itemsPerPage = 7;
  totalPages: number = 0;
  selectedColaborador: Colaborador | null = null;
  mostrarFormulario: boolean = false;
  mostrarModificar: boolean = false;
  mostrarModalEliminarFlag: boolean = false;
  textSearch: any;
  allColaboradores: Colaborador[] = [];;

  constructor(private collaboratorService: CollaboratorService, private router: Router) {
    this.updateColaboradores();
  }

  get totalPagesCalculated() {
    return Math.ceil(this.colaboradores.length / this.itemsPerPage);
  }

  updateColaboradores() {
    const params = {
      page: this.currentPage,
      pageSize: this.itemsPerPage
    };
  
    this.collaboratorService.getPaginatedCollaborators(this.currentPage, this.itemsPerPage)
      .then(response => {
        if (response && response.content && response.content.data) {
          this.allColaboradores = response.content.data.map((item: any) => {
            return {
              id: item.id,
              nombre: item.completeName,
              rut: item.rut,
              segmento: item.segment,
              gerencia: item.leadership,
              cargo: item.position,
              celular: item.phone,
              correo: item.email,
              estado: item.status,
              tieneFoto: item.hasPhoto,
              tieneFirma: item.hasSignature,
              tieneCredencial: item.hasCredential,
              sede: item.area
            };
          });
          this.colaboradores = [...this.allColaboradores]
          this.totalPages = Math.ceil(response.content.totalCount / this.itemsPerPage);
        } else {
          this.colaboradores = [];
          console.warn('No se encontraron colaboradores en la respuesta:', response);
        }
      })
      .catch(error => {
        console.error('Error al obtener colaboradores:', error);
  
        if (error.name === 'HttpErrorResponse' && error.status === 0) {
          alert('No se pudo conectar con el servidor. Por favor, verifique su conexión e inténtelo nuevamente.');
        } else {
          alert('Ocurrió un error al obtener los colaboradores: ' + error.message);
        }
      });
  }
  
  search() {
    if(this.textSearch)
    {
      this.textSearch =  this.textSearch.toLowerCase()
      this.colaboradores = this.allColaboradores.filter(x => x.nombre?.toLowerCase().includes(this.textSearch) || x.rut?.includes(this.textSearch) || x.correo?.toLowerCase().includes(this.textSearch))
    }
    else
      this.colaboradores = [...this.allColaboradores]
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
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateColaboradores();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateColaboradores();
    }
  }

  pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateColaboradores();
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
          this.colaboradores = this.colaboradores.filter(c => c.id !== this.selectedColaborador?.id);
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
          this.updateColaboradores();  
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
    this.updateColaboradores(); 
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