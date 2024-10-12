import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { MantenedoresComponent } from '../mantenedores/mantenedores.component';
import { SearchSectionComponent } from '../search-section/search-section.component';
import { CollaboratorService } from '../../services/collaborators.service';
import { GerenciaService } from '../../services/gerencia.service';
import { SegmentService } from '../../services/segment.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, MantenedoresComponent, SearchSectionComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'ddc-app';
  searchQuery: string = '';
  usuario = {
    email: '',
    password: ''
  };
  selectedFile: File | null = null; 

  constructor(
    private collaboratorService: CollaboratorService,
    private gerenciaService: GerenciaService,
    private segmentService: SegmentService
  ) {}

  onSearch() {}

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; 
      console.log('Archivo seleccionado:', this.selectedFile.name);
    }
  }

  onUpload() {
    if (this.selectedFile) {
      this.collaboratorService.uploadMissiveCollaborator(this.selectedFile);
      this.gerenciaService.uploadMissiveGerencia(this.selectedFile);
      this.segmentService.uploadMissiveSegment(this.selectedFile);
    } else {
      console.warn('No se ha seleccionado ningún archivo.');
    }
  }

  iniciarSesion() {
    if (this.usuario.email === "usuario@ejemplo.com" && this.usuario.password === "c") {
      console.log('Inicio de sesión exitoso');
    } else {
      console.log('Correo electrónico o contraseña incorrectos');
    }
  }
}
