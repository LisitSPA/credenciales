import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { Router } from '@angular/router'; 
import { SegmentosComponent } from './segmentos/segmentos.component';
import { GerenciasComponent } from './gerencia/gerencia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenerarCredencialComponent } from './generar-credencial/generar-credencial.component';
import { GenerarFirmaComponent } from './generar-firma/generar-firma.component';
import { SearchSectionComponent } from './search-section/search-section.component';
import { SpinnerService } from '../services/spinner.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router,public spinnerService: SpinnerService) {}

  isLoginRoute(): boolean {
    return this.router.url === '/';
  }

  isCredencialWebRoute(): boolean {
    const url = this.router.url.split('?')[0];
    return url === '/credencialweb';
  }
}
