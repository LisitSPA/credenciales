import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-section.component.html',
  styleUrls: ['./search-section.component.css']
})
export class SearchSectionComponent {
  searchQuery: string = '';
  isDropdownVisible: boolean = false; 
  selectedOption: string | null = null; 

  onSearch() {
    console.log('Buscar:', this.searchQuery);
  }

  onUpload() {
    this.isDropdownVisible = !this.isDropdownVisible; 
    console.log('Carga masiva de documentos');
  }

  onLoadOption(option: string) {
    console.log('Opción seleccionada:', option);
    this.selectedOption = option; 
  }

  onLoadExcel() {
    console.log('Cargar excel o .zip');
  }
}
