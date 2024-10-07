import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { MantenedoresComponent } from '../mantenedores/mantenedores.component';
import { SearchSectionComponent } from '../search-section/search-section.component';
import { CollaboratorService } from '../../services/collaborators.service';
import { GerenciaService } from '../../services/gerencia.service';
import { SegmentService } from '../../services/segment.service';
import { ColaboradoresComponent } from '../colaboradores/colaboradores.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, MantenedoresComponent,SearchSectionComponent,],  
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

  constructor(
    private collaboratorService: CollaboratorService ,
    private gerenciaService: GerenciaService ,
    private segmentService: SegmentService,
  ){

  }

  onSearch() {
  }

  onUpload() {

    // Implementar lógica de carga de archivos

    //cargar el archivo
    var file;

    this.collaboratorService.uploadMissiveCollaborator(file);

    //gerencias
    this.gerenciaService.uploadMissiveLeadership(file);

    //segmento
    this.segmentService.uploadMissiveSegment(file);
 main
  }

  

  iniciarSesion() {
    if (this.usuario.email === "usuario@ejemplo.com" && this.usuario.password === "c") {
      console.log('Inicio de sesión exitoso');
    } else {
      console.log('Correo electrónico o contraseña incorrectos');
    }
  }
}