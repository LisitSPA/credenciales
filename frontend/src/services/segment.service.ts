import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SegmentService {
  private apiUrl = `${environment.apiUrl}/segment`;

  constructor(private http: HttpClient) {}

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se encontró el token en localStorage.');
      throw new Error('No se encontró el token.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private createJsonHeaders(): HttpHeaders {
    const headers = this.createHeaders();
    return headers.set('Content-Type', 'application/json');
  }

  uploadMissiveSegment(file: File): Promise<any> {
    try {
      const headers = this.createHeaders();
      const formData = new FormData();
      formData.append('FileData', file);
      return this.http.post(`${this.apiUrl}/UploadMassive`, formData, { headers }).toPromise();
    } catch (error) {
      console.error('Error al cargar archivo masivo:', error);
      return Promise.reject(error);
    }
  }

  getPaginatedSegments(page: number, pageSize: number): Promise<any> {
    try {
      const headers = this.createHeaders();
      const params = { page: page.toString(), pageSize: pageSize.toString() };
      return this.http.get(`${this.apiUrl}/paginated`, { params, headers }).toPromise();
    } catch (error) {
      console.error('Error al obtener los segmentos paginados:', error);
      return Promise.reject(error);
    }
  }


  createSegment(nombreCompleto: string, colorSegmento: string): Promise<any> {
    try {
      const headers = this.createJsonHeaders(); 
  
      const payload = {
        Name: nombreCompleto,
        Color: colorSegmento,
      };
  
      return this.http.post(`${this.apiUrl}`, payload, { headers }).toPromise()
        .then(response => {
          return response;
        })
        .catch(error => {
          if (error.status === 409) { 
            console.error('El segmento ya existe:', error);
            throw new Error('El segmento con este nombre ya existe. Por favor, elige un nombre diferente.');
          } else {
            console.error('Error en la creación del segmento en el servidor:', error);
            throw error;
          }
        });
    } catch (error) {
      console.error('Error al intentar crear el encabezado o al crear el segmento:', error);
      return Promise.reject(error);
    }
  }
  

  deleteSegment(id: number): Promise<any> {
    try {
      const headers = this.createHeaders();
      return this.http.delete(`${this.apiUrl}/${id}`, { headers }).toPromise();
    } catch (error) {
      console.error('Error al eliminar el segmento:', error);
      return Promise.reject(error);
    }
  }

  updateSegment(id: number, nombre: string, color: string, active: boolean): Promise<any> {
    try {
      const headers = this.createJsonHeaders();
      const payload = {
        Id: id,
        Name: nombre,
        Color: color,
        Active: active,
      };
  
      return this.http.put(`${this.apiUrl}`, payload, { headers }).toPromise()
        .then(response => {
          return response;
        })
        .catch(error => {
          console.error('Error al actualizar el segmento en el servidor:', error);
          throw error;
        });
    } catch (error) {
      console.error('Error al intentar actualizar el segmento:', error);
      return Promise.reject(error);
    }
  }
  
}

