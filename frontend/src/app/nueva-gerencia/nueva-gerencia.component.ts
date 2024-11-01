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
  @Output() guardar = new EventEmitter<{ name: string, active: boolean }>();
  @Input() gerenciaSeleccionada!: { id: number; name: string; active: boolean };  

  nombreGerencia: string = '';  
  estadoGerencia: boolean = true;  

  cerrarModal() {
    this.cerrar.emit();
  }

  crearGerencia() {
    if (this.nombreGerencia.trim()) {
      this.guardar.emit({ name: this.nombreGerencia, active: this.estadoGerencia });
      this.cerrarModal(); 
    } else {
      console.error('El nombre de la gerencia no puede estar vacío.');
    }
  }
  

  guardarNuevaGerencia() {
    console.log('Guardando cambios para la gerencia seleccionada:', this.gerenciaSeleccionada);
    this.guardar.emit(this.gerenciaSeleccionada); 
  }
}
