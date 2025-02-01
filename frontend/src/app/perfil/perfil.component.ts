import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';
import { CollaboratorService } from '../../services/collaborators.service';
import { SpinnerService } from '../../services/spinner.service';

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

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private collaboratorService: CollaboratorService, private spinnerService: SpinnerService) {}

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
      nuevaClave: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      confirmarClave: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator }); 
  }
  


  loadUserDataFromStorage(): void {
    this.spinnerService.showSpinner();
    const id = localStorage.getItem('collaboratorId');
    const role = localStorage.getItem('role');
    this.collaboratorService.getCollaboratorById(Number(id)).then(colaborador => {
      if (colaborador && colaborador.content) {
        this.perfilForm.patchValue({
          nombre: colaborador.content.completeName,
          rut: colaborador.content.rut,
          telefono: colaborador.content.phone,
          email: colaborador.content.email,
          tipoPerfil: role
        });
      } else {
        console.error('El objeto `response.content` no contiene datos.');
      }
    }).catch(error => {
      console.error('Error al cargar los datos del colaborador:', error);
    }).finally(() => {
      this.spinnerService.hideSpinner();
    });
  }
  
  passwordValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    if (!/[a-zA-Z]/.test(value)) {
      return { missingLetter: true };
    }
    if (!/\d/.test(value)) {
      return { missingNumber: true };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return { missingSymbol: true };
    }
    return null;
  }
  cambiarPestana(pestaña: string): void {
    this.pestanaActiva = pestaña;
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const nuevaClave = group.get('nuevaClave')?.value;
    const confirmarClave = group.get('confirmarClave')?.value;
    return nuevaClave && confirmarClave && nuevaClave === confirmarClave ? null : { mismatch: true };
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
        const id = localStorage.getItem('userId'); 

        if (id) {
          const payload = {
            id: Number(id),
            oldPassword: claveActual,
            newPassword: nuevaClave
          };

          const token = localStorage.getItem('token');
          const headers = { Authorization: `Bearer ${token}` };

          this.http.put(`${environment.apiUrl}/auth/changePassword`, payload, { headers }).subscribe(
            () => {
              alert('¡Contraseña actualizada correctamente!');
              this.cambiarClaveForm.reset(); 
            },
            (error) => {
              alert('Error al actualizar la contraseña. Verifica los datos ingresados.');
            }
          );
        } else {
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
