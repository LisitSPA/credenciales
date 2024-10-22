import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {
  private apiUrl = 'http://localhost:5002/api/collaborators';  

  constructor(private _httpClient: HttpClient) {}

  uploadMissiveCollaborator(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('fileData', file);  

    return lastValueFrom(
      this._httpClient.post(`${this.apiUrl}/UploadMassive`, formData).pipe(
        catchError(error => {
          console.error('Error al subir colaboradores masivos:', error);
          if (error.name === 'HttpErrorResponse' && error.status === 0) {
            console.error('No se pudo conectar con el servidor. Por favor, verifique su conexión e inténtelo nuevamente.');
          } else {
            console.error('Ocurrió un error al subir colaboradores masivos: ' + error.message);
          }
          return throwError(() => error);
        })
      )
    );
  }

  getPaginatedCollaborators(page: number, pageSize: number): Promise<any> {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return lastValueFrom(
      this._httpClient.get(`${this.apiUrl}/paginated`, { params }).pipe(
        catchError(error => {
          console.error('Error al obtener colaboradores paginados:', error);
          if (error.name === 'HttpErrorResponse' && error.status === 0) {
            console.error('No se pudo conectar con el servidor. Por favor, verifique su conexión e inténtelo nuevamente.');
          } else {
            console.error('Ocurrió un error al obtener colaboradores paginados: ' + error.message);
          }
          return throwError(() => error);
        })
      )
    );  
  }

  deleteCollaborator(id: number): Promise<any> {
    return lastValueFrom(
      this._httpClient.delete(`${this.apiUrl}/${id}`).pipe(
        catchError(error => {
          console.error('Error al eliminar colaborador:', error);
          if (error.name === 'HttpErrorResponse' && error.status === 0) {
            console.error('No se pudo conectar con el servidor. Por favor, verifique su conexión e inténtelo nuevamente.');
          } else {
            console.error('Ocurrió un error al eliminar colaborador: ' + error.message);
          }
          return throwError(() => error);
        })
      )
    );   
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
        catchError(error => {
          console.error('Error al crear colaborador:', error);
          if (error.name === 'HttpErrorResponse' && error.status === 0) {
            console.error('No se pudo conectar con el servidor. Por favor, verifique su conexión e inténtelo nuevamente.');
          } else {
            console.error('Ocurrió un error al crear colaborador: ' + error.message);
          }
          return throwError(() => error);
        })
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
        catchError(error => {
          console.error('Error al actualizar colaborador:', error);
          if (error.name === 'HttpErrorResponse' && error.status === 0) {
            console.error('No se pudo conectar con el servidor. Por favor, verifique su conexión e inténtelo nuevamente.');
          } else {
            console.error('Ocurrió un error al actualizar colaborador: ' + error.message);
          }
          return throwError(() => error);
        })
      )
    );
  }

  getCollaboratorById(id: number): Promise<any> {
    return lastValueFrom(
      this._httpClient.get(`${this.apiUrl}/${id}`).pipe(
        catchError(error => {
          console.error('Error al obtener colaborador:', error);
          if (error.name === 'HttpErrorResponse' && error.status === 0) {
            console.error('No se pudo conectar con el servidor. Por favor, verifique su conexión e inténtelo nuevamente.');
          } else {
            console.error('Ocurrió un error al obtener colaborador: ' + error.message);
          }
          return throwError(() => error);
        })
      )
    );
  }
}
