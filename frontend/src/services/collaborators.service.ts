import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {
  private apiUrl = environment.apiUrl+"/collaborators";  
  headers: any;

  constructor(private _httpClient: HttpClient, private _snackBar: MatSnackBar) {
    this.headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }); 
   }

  uploadMissiveCollaborator(file: File): Promise<any> {

    let headers = this.headers;
    const formData = new FormData();
    formData.append('fileData', file);  

    return lastValueFrom(
      this._httpClient.post(`${this.apiUrl}/UploadMassive`, formData,{headers}).pipe(
        catchError(error => this.handleError(error, 'No se pudo subir colaboradores masivos. Verifique la conexión.'))
      )
    );
  }

  getPaginatedCollaborators(page: number, pageSize: number): Promise<any> {
    let headers = this.headers;
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return lastValueFrom(
      this._httpClient.get(`${this.apiUrl}/paginated`, { params, headers }).pipe(
        catchError(error => this.handleError(error, 'No se pudo obtener la lista de colaboradores. Verifique la conexión.'))
      )
    );  
  }

  deleteCollaborator(id: number): Promise<any> {
    let headers = this.headers;
    return lastValueFrom(
      this._httpClient.delete(`${this.apiUrl}/${id}`,{headers}).pipe(
        catchError(error => this.handleError(error, 'No se pudo eliminar el colaborador. Verifique la conexión.'))
      )
    );   
  }

  createCollaborator(colaborador: any): Promise<any> {
    let headers = this.headers;
    const formData = new FormData();
    formData.append('completeName', colaborador.CompleteName);
    formData.append('rut', colaborador.RUT);
    formData.append('leadershipId', colaborador.LeadershipId.toString());
    formData.append('segmentId', colaborador.SegmentId.toString());
    formData.append('position', colaborador.Position);
    formData.append('sede', colaborador.Area);
    formData.append('phone', colaborador.Phone);
    formData.append('email', colaborador.Email);
    formData.append('eCollaboratorStatus', colaborador.ECollaboratorStatus.toString());

    if (colaborador.Photo) {
        formData.append('Photo', colaborador.Photo);
    }

    return lastValueFrom(
      this._httpClient.post(`${this.apiUrl}`, formData, { headers }).pipe(
        catchError(error => {
                console.error('Error al crear colaborador:', error);
                return this.handleError(error, 'No se pudo crear el colaborador. Verifique la conexión.');
            })
        )
    ).then(response => {
        return response;
    }).catch(error => {
        console.error('Error capturado en catch:', error);
        throw error;
    });
}


  
updateCollaborator(id: number, colaborador: any): Promise<any> {
  let headers = this.headers;
  const payload = {
      Id: id, 
      CompleteName: colaborador.CompleteName,
      LeadershipId: colaborador.LeadershipId,
      SegmentId: colaborador.SegmentId,
      Position: colaborador.Position,
      Area: colaborador.Area || "Sin Sede",
      Phone: colaborador.Phone,
      Email: colaborador.Email,
      ECollaboratorStatus: colaborador.ECollaboratorStatus,
  };

  return lastValueFrom(
    this._httpClient.put(`${this.apiUrl}`, payload, { headers }).pipe(
      catchError(error => this.handleError(error, 'No se pudo actualizar el colaborador. Verifique la conexión.'))
      )
  );
}

  getCollaboratorById(id: number): Promise<any> {
    let headers = this.headers;
    return lastValueFrom(
      this._httpClient.get(`${this.apiUrl}/${id}`,{headers}).pipe(
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

  uploadAttachment(collaboratorId: number, file: File, attachmentType: string): Promise<any> {
    const headers = this.headers;
    const formData = new FormData();
    formData.append('Attachment', file);
    formData.append('AttachmentType', attachmentType);
    formData.append('CollaboratorId', collaboratorId.toString());
  
    return lastValueFrom(
      this._httpClient.post(`${this.apiUrl}/attachments`, formData, { headers }).pipe(
        catchError(error => this.handleError(error, 'No se pudo subir el archivo adjunto. Verifique la conexión.'))
      )
    );
  }
  getAttachment(colaboradorId: number, tipoArchivo: string): Promise<any> {
    let headers = this.headers;
    return lastValueFrom(
      this._httpClient.get(`${this.apiUrl}/${colaboradorId}/attachments/${tipoArchivo}`, {
        headers,
        responseType: 'blob' 
      }).pipe(
        catchError(error => this.handleError(error, 'No se pudo obtener el archivo adjunto. Verifique la conexión.'))
      )
    );
  }
  
  
}
