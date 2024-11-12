import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nueva-gerencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-gerencia.component.html',
  styleUrls: ['./nueva-gerencia.component.css']
})
export class NuevaGerenciaComponent {
  @Input() mostrarModal: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<{ name: string }>(); 
  @Input() gerenciaSeleccionada!: { id: number; name: string; active: boolean };  

  nombreGerencia: string = '';  

  cerrarModal() {
    this.cerrar.emit();
  }

  crearGerencia() {
    if (!this.nombreGerencia || !this.nombreGerencia.trim()) {
      console.error('El nombre de la gerencia no puede estar vacío.');
      alert('Por favor, ingresa un nombre válido para la gerencia.');
      return;
    }

    const nuevaGerencia = {
      name: this.nombreGerencia.trim(),
    };

    this.guardar.emit(nuevaGerencia); 
    this.cerrarModal();
  }
}
