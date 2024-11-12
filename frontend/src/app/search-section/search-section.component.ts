import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollaboratorService } from '../../services/collaborators.service';
import { SegmentService } from '../../services/segment.service';
import { GerenciaService } from '../../services/gerencia.service';

@Component({
  selector: 'app-search-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-section.component.html',
  styleUrls: ['./search-section.component.css']
})
export class SearchSectionComponent {
  @Output() colaboradoresActualizados = new EventEmitter<any[]>(); 

  searchQuery: string = '';
  isDropdownVisible: boolean = false; 
  selectedOption: string | null = null; 
  selectedFile: File | null = null;  
  mostrarMensajeExito: boolean = false;

  constructor(
    private collaboratorService: CollaboratorService,
    private segmentService: SegmentService,
    private gerenciaService: GerenciaService
  ) {}

  onSearch() {
  }

  onUpload() {
    this.isDropdownVisible = !this.isDropdownVisible; 
  }

  onLoadOption(option: string) {
    this.selectedOption = option; 
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
  
      if (!allowedFileTypes.includes(file.type)) {
        alert('Tipo de archivo no permitido. Solo se permiten archivos Excel o CSV.');
        this.selectedFile = null;
        return;
      }
  
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }
  

  onLoadExcel() {
    if (this.selectedFile && this.selectedOption) {
        let uploadPromise;

        switch (this.selectedOption) {
            case 'Colaboradores':
                uploadPromise = this.collaboratorService.uploadMissiveCollaborator(this.selectedFile);
                break;
            case 'Segmentos':
                uploadPromise = this.segmentService.uploadMissiveSegment(this.selectedFile);
                break;
            case 'Gerencias':
                uploadPromise = this.gerenciaService.uploadMissiveGerencia(this.selectedFile);
                break;
            default:
                console.warn('Opción no válida seleccionada.');
                return;
        }

        uploadPromise
            .then(response => {
                this.mostrarMensajeExito = true;

                if (this.selectedOption === 'Colaboradores') {
                    this.colaboradoresActualizados.emit(response); 
                }

                setTimeout(() => this.mostrarMensajeExito = false, 3000);
            })
            .catch(error => {
                console.error('Error en la carga:', error);
            });
    } else {
        console.warn('Por favor, selecciona un archivo y una opción.');
    }
  }
}
