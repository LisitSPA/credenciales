import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevoColaboradorComponent } from '../nuevo-colaborador/nuevo-colaborador.component';

interface Colaborador {
  nombre: string;
  rut: string;
  area: string;
  jefatura: string;
  cargo: string;
  celular: string;
  correo: string;
  color_id: string;
}

@Component({
  selector: 'app-colaboradores',
  standalone: true,
  imports: [CommonModule, NuevoColaboradorComponent],
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.css']
})
export class ColaboradoresComponent {
  colaboradores: Colaborador[] = [
    {
      nombre: 'Nombre Apellido', 
      rut: '000000',
      area: 'Área / Centro de Coste',
      jefatura: 'Jefatura',
      cargo: 'Cargo',
      celular: '+00 0000 000 00',
      correo: 'correo@ddc.co',
      color_id: 'administracion'
    },
    {
      nombre: 'Nombre Apellido', 
      rut: '000000',
      area: 'Área / Centro de Coste',
      jefatura: 'Jefatura',
      cargo: 'Cargo',
      celular: '+00 0000 000 00',
      correo: 'correo@ddc.co',
      color_id: 'packaging'
    },
    {
      nombre: 'Nombre Apellido', 
      rut: '000000',
      area: 'Área / Centro de Coste',
      jefatura: 'Jefatura',
      cargo: 'Cargo',
      celular: '+00 0000 000 00',
      correo: 'correo@ddc.co',
      color_id: 'frigorifico'
    },{
      nombre: 'Nombre Apellido', 
      rut: '000000',
      area: 'Área / Centro de Coste',
      jefatura: 'Jefatura',
      cargo: 'Cargo',
      celular: '+00 0000 000 00',
      correo: 'correo@ddc.co',
      color_id: 'frigorifico'
    },
  ];

  paginatedColaboradores: Colaborador[] = [];
  currentPage = 1;
  itemsPerPage = 7;

  constructor() {
    this.updatePaginatedColaboradores();
  }

  get totalPages() {
    return Math.ceil(this.colaboradores.length / this.itemsPerPage);
  }

  updatePaginatedColaboradores() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedColaboradores = this.colaboradores.slice(start, end);
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
  mostrarFormulario: boolean = false;

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }
}
