import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Area {
  centro_coste: string;
  fecha: string;
  editado: string;
  color_id: string; 
}

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.css'
})
export class AreasComponent {
  areas: Area[] = [
    {
      centro_coste: 'Administración',
      fecha: '2024-10-01',
      editado: '2024-10-01',
      color_id: 'administracion',
    },
    {
      centro_coste: 'Packaging',
      fecha: '2024-10-01',
      editado: '2024-10-01',
      color_id: 'packaging',
    },
    {
      centro_coste: 'Frigorífico',
      fecha: '2024-10-01',
      editado: '2024-10-01',
      color_id: 'frigorifico',
    },
  ];
  
  paginatedColaboradores: Area[] = [];
  currentPage = 1;
  itemsPerPage = 7;

  constructor() {
    this.updatePaginatedColaboradores();
  }

  get totalPages() {
    return Math.ceil(this.areas.length / this.itemsPerPage);
  }

  updatePaginatedColaboradores() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedColaboradores = this.areas.slice(start, end);
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
}
