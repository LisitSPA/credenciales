import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { MantenedoresComponent } from '../mantenedores/mantenedores.component';
import { SearchSectionComponent } from '../search-section/search-section.component';
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

  onSearch() {
  }

  onUpload() {
  }

  iniciarSesion() {
    if (this.usuario.email === "usuario@ejemplo.com" && this.usuario.password === "c") {
      console.log('Inicio de sesión exitoso');
    } else {
      console.log('Correo electrónico o contraseña incorrectos');
    }
  }
}