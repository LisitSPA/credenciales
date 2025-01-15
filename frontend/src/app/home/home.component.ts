import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { MantenedoresComponent } from '../mantenedores/mantenedores.component';
import { SearchSectionComponent } from '../search-section/search-section.component';
import { CollaboratorService } from '../../services/collaborators.service';
import { GerenciaService } from '../../services/gerencia.service';
import { SegmentService } from '../../services/segment.service';
import { SpinnerService } from '../../services/spinner.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, MantenedoresComponent, SearchSectionComponent, HttpClientModule],
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
  data: any;

  constructor(
    private collaboratorService: CollaboratorService,
    private gerenciaService: GerenciaService,
    private spinnerService: SpinnerService,
    private http: HttpClient,
    private segmentService: SegmentService
  ) {}

  ngOnInit() {
    this.spinnerService.showSpinner(); 
    
    this.http.get<any>(`${environment.apiUrl}/data/home`).subscribe({
      next: () => {
        setTimeout(() => {
          this.spinnerService.hideSpinner(); 
        }, 2000); 
      },
      error: () => {
        console.error('Error al cargar los datos:');
        setTimeout(() => {
          this.spinnerService.hideSpinner(); 
        }, 1000); 
      }
    });
  }

  onSearch() {}

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
  

  onUpload() {
    if (this.selectedFile) {
      this.spinnerService.showSpinner();
      this.collaboratorService.uploadMissiveCollaborator(this.selectedFile);
      this.gerenciaService.uploadMissiveGerencia(this.selectedFile);
      this.segmentService.uploadMissiveSegment(this.selectedFile);
      this.spinnerService.hideSpinner();
    } else {
      console.warn('No se ha seleccionado ningún archivo.');
    }
  }

  iniciarSesion() {
    if (this.usuario.email === "usuario@ejemplo.com" && this.usuario.password === "c") {
    } else {
    }
  }
}
