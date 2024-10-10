import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EliminarComponent } from '../eliminar/eliminar.component';

interface Jefatura {
  jefatura: string;
  fecha: string;
  editado: string;
  estado: string;
}
@Component({
  selector: 'app-jefaturas',
  standalone: true,
  imports: [CommonModule, EliminarComponent],
  templateUrl: './jefaturas.component.html',
  styleUrl: './jefaturas.component.css'
})
export class JefaturasComponent {
  jefaturas: Jefatura[] = [
    {
      jefatura: 'Nombre Jefatura',
      fecha: '000000',
      editado: '000000',
      estado: 'Activo',
    },
    {
      jefatura: 'Nombre Jefatura',
      fecha: '000000',
      editado: '000000',
      estado: 'Activo',
    },{
      jefatura: 'Nombre Jefatura',
      fecha: '000000',
      editado: '000000',
      estado: 'Inactivo',
    },
  ];

  paginatedColaboradores: Jefatura[] = [];
  currentPage = 1;
  itemsPerPage = 7;

  constructor() {
    this.updatePaginatedColaboradores();
  }

  get totalPages() {
    return Math.ceil(this.jefaturas.length / this.itemsPerPage);
  }

  updatePaginatedColaboradores() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedColaboradores = this.jefaturas.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
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
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedColaboradores();
  }

  mostrarModalEliminar: boolean = false;
  eliminar() {
    this.mostrarModalEliminar = true;  
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false; 
  }
}
