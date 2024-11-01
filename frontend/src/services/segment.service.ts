import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SegmentService {
  private apiUrl = environment.apiUrl + "/segment";  

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  uploadMissiveSegment(file: File): Promise<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('FileData', file);
    return this.http.post(`${this.apiUrl}/UploadMassive`, formData, { headers }).toPromise();
  }

  getPaginatedSegments(page: number, pageSize: number): Promise<any> {
    const headers = this.getHeaders();
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return this.http.get(`${this.apiUrl}/paginated`, { params, headers }).toPromise();
  }

  createSegment(nombreCompleto: string, colorSegmento: string, estadoSegmento: boolean): Promise<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('NombreCompleto', nombreCompleto);
    formData.append('Color', colorSegmento);
    formData.append('Active', estadoSegmento.toString());

    return this.http.post(`${this.apiUrl}`, formData, { headers }).toPromise()
      .then(response => {
        console.log('Respuesta del servidor:', response);
        return response;
      })
      .catch(error => {
        console.error('Error en la creación del segmento en el servidor:', error);
        throw error;
      });
  }

  deleteSegment(id: number): Promise<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).toPromise();
  }
}
