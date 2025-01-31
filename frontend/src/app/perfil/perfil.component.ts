import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  cambiarClaveForm!: FormGroup;
  pestanaActiva: string = 'misDatos';
  isDisabled: boolean = true;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUserDataFromStorage(); 
  }

  initForms(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', []],
      rut: ['', []],
      codigoPais: ['+56', []],
      telefono: ['', []],
      email: ['', []],
      tipoPerfil: ['Colaborador', []]
    });

    this.cambiarClaveForm = this.fb.group({
      claveActual: ['', [Validators.required]],
      nuevaClave: ['', [Validators.required, Validators.minLength(6)]],
      confirmarClave: ['', [Validators.required]]
    });
  }

  loadUserDataFromStorage(): void {
    const userData = JSON.parse(localStorage.getItem('print') || '{}');
    const userRole = localStorage.getItem('role');
  
    if (Object.keys(userData).length > 0) {
      const formattedData = {
        nombre: userData.nombre,
        rut: userData.rut,
        telefono: userData.celular,
        email: userData.correo,
        tipoPerfil: userRole || 'Usuario'
      };
  
      this.perfilForm.patchValue(formattedData);
    } else {
      console.error('No se encontraron datos en el localStorage.');
    }
  }
  
  cambiarPestana(pestaña: string): void {
    this.pestanaActiva = pestaña;
  }

  onSubmit(): void {
    console.log('Datos del usuario actualizados:', this.perfilForm.value);
  }

  onCancel(): void {
    this.router.navigate(['/home']); 
  }
  
  onSubmitClave(): void {
    if (this.cambiarClaveForm.valid) {
      const { claveActual, nuevaClave, confirmarClave } = this.cambiarClaveForm.value;

      if (nuevaClave === confirmarClave) {
        const username = localStorage.getItem('username'); 

        if (username) {
          const payload = {
            username: username,
            oldPassword: claveActual,
            newPassword: nuevaClave
          };

          const token = localStorage.getItem('token');
          const headers = { Authorization: `Bearer ${token}` };

          this.http.put(`${environment.apiUrl}/auth/changePassword`, payload, { headers }).subscribe(
            () => {
              console.log('Contraseña actualizada con éxito');
              alert('¡Contraseña actualizada correctamente!');
              this.cambiarClaveForm.reset(); 
            },
            (error) => {
              console.error('Error al cambiar la contraseña:', error);
              alert('Error al actualizar la contraseña. Verifica los datos ingresados.');
            }
          );
        } else {
          console.error('El username no está disponible en localStorage.');
          alert('Error al obtener el nombre de usuario.');
        }
      } else {
        alert('Las contraseñas no coinciden. Por favor, verifica e intenta de nuevo.');
      }
    } else {
      alert('El formulario de cambio de contraseña no es válido.');
    }
  }
}
