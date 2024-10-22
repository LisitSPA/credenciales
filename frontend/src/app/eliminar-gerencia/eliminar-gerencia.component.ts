import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-eliminar-gerencia',
  standalone: true,
  templateUrl: './eliminar-gerencia.component.html',
  styleUrls: ['./eliminar-gerencia.component.css']
})
export class EliminarGerenciaComponent {
  @Output() confirmar = new EventEmitter<void>();  
  @Output() cerrar = new EventEmitter<void>();     

  confirmarEliminacion() {
    this.confirmar.emit(); 
  }

  cerrarModal() {
    this.cerrar.emit();  
  }
}
