import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { Router } from '@angular/router'; 
import { AreasComponent } from './areas/areas.component';
import { JefaturasComponent } from './jefaturas/jefaturas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CredencialComponent } from './credencial/credencial.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ColaboradoresComponent,
    AreasComponent,
    JefaturasComponent,
    FormsModule,
    ReactiveFormsModule,
    CredencialComponent,

  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {}

  isLoginRoute(): boolean {
    return this.router.url === '/';
  }
}
