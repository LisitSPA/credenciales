import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-eliminar',
  standalone: true,
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<void>();

  confirmarEliminacion() {
    this.confirmar.emit();  
  }

  cancelarEliminacion() {
    this.cerrar.emit();  
  }
}
