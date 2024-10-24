import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {
  private apiUrl = 'https://credenciales-api-evcvgchfgmguc3gf.canadacentral-01.azurewebsites.net/ap/i';  

  constructor(private _httpClient: HttpClient, private _snackBar: MatSnackBar) {}

  uploadMissiveCollaborator(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('fileData', file);  

    return lastValueFrom(
      this._httpClient.post(`${this.apiUrl}/UploadMassive`, formData).pipe(
        catchError(error => this.handleError(error, 'No se pudo subir colaboradores masivos. Verifique la conexión.'))
      )
    );
  }

  getPaginatedCollaborators(page: number, pageSize: number): Promise<any> {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return lastValueFrom(
      this._httpClient.get(`${this.apiUrl}/paginated`, { params }).pipe(
        catchError(error => this.handleError(error, 'No se pudo obtener la lista de colaboradores. Verifique la conexión.'))
      )
    );  
  }

  deleteCollaborator(id: number): Promise<any> {
    return lastValueFrom(
      this._httpClient.delete(`${this.apiUrl}/${id}`).pipe(
        catchError(error => this.handleError(error, 'No se pudo eliminar el colaborador. Verifique la conexión.'))
      )
    );   
  }

  createCollaborator(colaborador: any): Promise<any> {
    const formData = new FormData();
    formData.append('CompleteName', colaborador.CompleteName);
    formData.append('RUT', colaborador.RUT);
    formData.append('LeadershipId', colaborador.LeadershipId.toString());
    formData.append('SegmentId', colaborador.SegmentId.toString());
    formData.append('Position', colaborador.Position);
    formData.append('Sede', colaborador.Sede);
    formData.append('Phone', colaborador.Phone);
    formData.append('Email', colaborador.Email);
    formData.append('ECollaboratorStatus', colaborador.ECollaboratorStatus.toString());
  
    if (colaborador.Photo) {
      formData.append('Photo', colaborador.Photo);
    }
  
    return lastValueFrom(
      this._httpClient.post(`${this.apiUrl}`, formData).pipe(
        catchError(error => this.handleError(error, 'No se pudo crear el colaborador. Verifique la conexión.'))
      )
    );
  }

  updateCollaborator(id: number, colaborador: any): Promise<any> {
    const payload = {
      Id: id,  
      CompleteName: colaborador.CompleteName,
      LeadershipId: colaborador.LeadershipId,
      SegmentId: colaborador.SegmentId,
      Position: colaborador.Position,
      Sede: colaborador.Sede || "Sin Sede", 
      Phone: colaborador.Phone,
      Email: colaborador.Email,
      ECollaboratorStatus: colaborador.ECollaboratorStatus,
    };
  
    return lastValueFrom(
      this._httpClient.put(`${this.apiUrl}/${id}`, payload).pipe(
        catchError(error => this.handleError(error, 'No se pudo actualizar el colaborador. Verifique la conexión.'))
      )
    );
  }

  getCollaboratorById(id: number): Promise<any> {
    return lastValueFrom(
      this._httpClient.get(`${this.apiUrl}/${id}`).pipe(
        catchError(error => this.handleError(error, 'No se pudo obtener los detalles del colaborador. Verifique la conexión.'))
      )
    );
  }
  private handleError(error: any, customMessage: string) {
    if (error.status === 0) {
      this._snackBar.open('No se pudo conectar con el servidor. Por favor, verifique su conexión e inténtelo nuevamente.', 'Cerrar', {
        duration: 5000,
      });
    } else {
      this._snackBar.open(customMessage + ' ' + error.message, 'Cerrar', {
        duration: 5000,
      });
    }
    return throwError(() => error);
  }


  private colaborador: any;

  setColaborador(colaborador: any) {
    this.colaborador = colaborador;
  }

  getColaborador() {
    return this.colaborador;
  }

  clearColaborador() {
    this.colaborador = null;
  }
}
