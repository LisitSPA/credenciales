import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';
import { Router } from '@angular/router';
import { CollaboratorService } from '../../services/collaborators.service';

interface Colaborador {
  id: number;
  nombre: string;
  rut: string;
  segmento: string;
  gerencia: string;
  cargo: string;
  celular: string;
  correo: string;
  estado: string;
  sede: string;
}

@Component({
  selector: 'app-generar-credencial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generar-credencial.component.html',
  styleUrls: ['./generar-credencial.component.css']
})
export class GenerarCredencialComponent implements OnInit {
  colaboradores: any[] = []; 
  selectedColaboradorId: string = ''; 
  nombre: string = '';
  rut: string = '';
  gerencia: string = '';
  cargo: string = '';
  segmento: string = '';
  celular: string = '';
  correo: string = '';
  sede: string = '';
  foto: File | null = null;
  qrCodeUrl: string | undefined;

  disableFields: boolean = true; 

  @Output() cerrar = new EventEmitter<void>();

  private ipLocal: string = '192.168.3.102';
  colaborador!: Colaborador;

  constructor(private router: Router, private collaboratorService: CollaboratorService) {}

  ngOnInit() {
    this.loadColaboradores();
  }

  async loadColaboradores() {
    try {
      // const response = await this.collaboratorService.getPaginatedCollaborators(1, 100);
      // if (response && response.content && response.content.data) {
      //   this.colaboradores = response.content.data;
      // }

      var printId = localStorage.getItem("print");
      if(printId){
        this.colaborador = JSON.parse(printId)
        this.onSelectColaborador()
      }
    
    } catch (error) {
      console.error('Error al cargar colaboradores:', error);
    }
  }

  onSelectColaborador() {
    // const colaborador = this.colaboradores.find(c => c.id === parseInt(this.selectedColaboradorId, 10));
    const colaborador = this.colaborador;
    if (colaborador) {
      this.nombre = colaborador.nombre;
      this.rut = colaborador.rut;
      this.gerencia = colaborador.gerencia;
      this.cargo = colaborador.cargo;
      this.segmento = colaborador.segmento;
      this.celular = colaborador.celular;
      this.correo = colaborador.correo;
      this.sede = colaborador.sede;

      this.disableFields = false;
    } else {
      this.disableFields = true;
    }
  }

  async guardarDatos() {
    if (!this.nombre || !this.cargo || !this.correo) {
      alert('Por favor, rellena los campos obligatorios.');
      return;
    }

    const userData = {
      nombre: this.nombre,
      rut: this.rut,
      gerencia: this.gerencia,
      cargo: this.cargo,
      segmento: this.segmento,
      celular: this.celular,
      correo: this.correo,
      sede: this.sede,
      foto: this.foto,
    };

    await this.generateQRCode();
    localStorage.setItem('colaboradorData', JSON.stringify({ ...userData, qrCodeUrl: this.qrCodeUrl }));

    this.router.navigate(['/firmaexitosa']);
  }

  async generateQRCode() {
    const url = `http://${this.ipLocal}:4200/credencialweb`;

    try {
      this.qrCodeUrl = await QRCode.toDataURL(url);
    } catch (err) {
      console.error('Error generando QR Code:', err);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.foto = input.files[0];
    }
  }
  redirigirFirmaExitosa() {
    if (this.colaborador) {
      this.router.navigate(['/firmaexitosa', this.colaborador.id]); 
    } else {
      alert('Por favor, selecciona un colaborador válido.');
    }
  }
  
  redirigirCredencialExitosa() {
    if (this.colaborador) {
      this.router.navigate(['/credencialexitosa', this.colaborador.id]);
    } else {
      alert('Por favor, selecciona un colaborador válido.');
    }
  }
  
  obtenerColaboradorSeleccionado(): Colaborador | null {
    return this.colaboradores.find(c => c.id === parseInt(this.selectedColaboradorId, 10)) || null;
  }
  
}
