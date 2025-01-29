import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [CommonModule] 
})
export class FooterComponent {
  mostrarModalAyuda: boolean = false;

  openModal(event: Event): void {
    event.preventDefault(); 
    this.mostrarModalAyuda = true;
  }

  closeModal(): void {
    this.mostrarModalAyuda = false;
  }
}
