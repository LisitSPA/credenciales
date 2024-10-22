import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modificar-gerencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modificar-gerencia.component.html',
  styleUrls: ['./modificar-gerencia.component.css']
})
export class ModificarGerenciaComponent {
  @Input() gerenciaSeleccionada!: { id: number; name: string; active: boolean };  
  @Output() cerrar = new EventEmitter<void>();  
  @Output() guardar = new EventEmitter<{ id: number; name: string; active: boolean }>();  

  cerrarModalModificar() {
    console.log('Cerrando modal sin guardar');
    this.cerrar.emit();  
  }

  guardarModificacionGerencia() {
    console.log('Guardando cambios para la gerencia seleccionada:', this.gerenciaSeleccionada);
    this.guardar.emit(this.gerenciaSeleccionada); 
  }
}
