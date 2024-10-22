import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {
  private apiUrl = 'http://localhost:5002/api/collaborators';  

  constructor(private _httpClient: HttpClient) {}

  uploadMissiveCollaborator(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('fileData', file);  

    return lastValueFrom(this._httpClient.post(`${this.apiUrl}/UploadMassive`, formData));
  }

  getPaginatedCollaborators(page: number, pageSize: number): Promise<any> {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return lastValueFrom(this._httpClient.get(`${this.apiUrl}/paginated`, { params }));  
  }

  deleteCollaborator(id: number): Promise<any> {
    return lastValueFrom(this._httpClient.delete(`${this.apiUrl}/${id}`));   
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
  
    return lastValueFrom(this._httpClient.post(`${this.apiUrl}`, formData));
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
  
    return lastValueFrom(this._httpClient.put(`${this.apiUrl}/${id}`, payload));
  }
  getCollaboratorById(id: number): Promise<any> {
    return lastValueFrom(this._httpClient.get(`${this.apiUrl}/${id}`))
      .then(response => {
        console.log('Datos recibidos del colaborador:', response);  
        return response;
      })
      .catch(error => {
        console.error('Error al obtener colaborador:', error);
        throw error;
      });
  }
  
}
  
  
  
  
  
  

