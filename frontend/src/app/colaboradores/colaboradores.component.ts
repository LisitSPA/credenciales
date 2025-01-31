import { Component, OnInit, OnDestroy } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevoColaboradorComponent } from '../nuevo-colaborador/nuevo-colaborador.component';
import { EliminarComponent } from '../eliminar/eliminar.component';
import { ModificarColaboradorComponent } from '../modificar-colaborador/modificar-colaborador.component';
import { Router } from '@angular/router';
import { CollaboratorService } from '../../services/collaborators.service';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { SpinnerService } from '../../services/spinner.service';
import { AuthService } from '../../services/auth.service';

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
export class ColaboradoresComponent implements OnInit, OnDestroy {

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
  canSeeHome: boolean = false;
  private inactivityTimeout: any;
  private readonly INACTIVITY_TIME = 900000;


  constructor(
    private collaboratorService: CollaboratorService, 
    private router: Router, 
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private renderer: Renderer2,
  ) {
    this.cargarListaColaboradores();
  }

  ngOnInit() {
    this.resetInactivityTimeout();
    this.addUserInteractionListeners();
  }  

  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredColaboradores.length);
    return `${start} a ${end}`;
  }

  cargarListaColaboradores() {
    this.spinnerService.showSpinner();

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
        setTimeout(() => this.spinnerService.hideSpinner(), 1000);     
       })
      .catch(error => {
        setTimeout(() => this.spinnerService.hideSpinner(), 1500);
      });
  }
  
  updatePaginatedColaboradores() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedColaboradores = this.filteredColaboradores.slice(start, end);
    console.log(`Mostrando elementos ${start + 1} a ${end} de ${this.filteredColaboradores.length}`);
  }
  
  search() {
    if (this.textSearch) {
      const searchText = this.textSearch.toLowerCase();
      this.filteredColaboradores = this.allColaboradores.filter(x =>
        x.nombre.toLowerCase().includes(searchText) ||
        x.rut.includes(searchText) ||
        x.correo.toLowerCase().includes(searchText)
      );
    } else {
      this.filteredColaboradores = [...this.allColaboradores];
    }
    this.currentPage = 1; 
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
    this.spinnerService.showSpinner();
    localStorage.setItem('print', JSON.stringify(this.selectedColaboradores[0]));
    this.router.navigate(['/generar']).then(() => {
      setTimeout(() => this.spinnerService.hideSpinner(), 1500); 
    });
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
    const totalPages = this.totalPagesCalculated;
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

  changeItemsPerPage() {
    this.itemsPerPage = +this.itemsPerPage; 
    this.currentPage = 1; 
    this.updatePaginatedColaboradores(); 
  }
  

  goToPage(page: number | string) {
    if (typeof page === 'number') {
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
      this.spinnerService.showSpinner();

      this.collaboratorService.deleteCollaborator(this.selectedColaborador.id).then(response => {
        if (response && response.statusCode === 200) {
          this.cargarListaColaboradores();
          this.cerrarModalEliminar(); 
        } else {
        }
        setTimeout(() => this.spinnerService.hideSpinner(), 1500);
      }).catch(error => {
        alert('Error al eliminar colaborador: ' + error.message);
        setTimeout(() => this.spinnerService.hideSpinner(), 1500);
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
      this.spinnerService.showSpinner();

      this.collaboratorService.updateCollaborator(colaboradorModificado.id, colaboradorModificado)
        .then(response => {
          this.updatePaginatedColaboradores();  
          this.mostrarModificar = false;
          setTimeout(() => this.spinnerService.hideSpinner(), 1500); 
        })
        .catch(error => {
          if (error.status === 400 && error.error && error.error.message) {
            alert('Error: ' + error.error.message);  
          } else {
            alert('Error al modificar colaborador: ' + error.message);  
          }
          setTimeout(() => this.spinnerService.hideSpinner(), 1500);
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
    this.spinnerService.showSpinner();

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
        setTimeout(() => this.spinnerService.hideSpinner(), 1500);
      })
      .catch(error => {
        console.error(`Error al descargar el archivo ${tipoArchivo} para el colaborador con ID ${colaboradorId}:`, error);
        alert(`Hubo un error al descargar el archivo de ${tipoArchivo}.`);
        setTimeout(() => this.spinnerService.hideSpinner(), 1500);
      });
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