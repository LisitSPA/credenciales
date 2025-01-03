import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class GerenciaService {
  private apiUrl = environment.apiUrl + '/leadership';
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    });
  }

  uploadMissiveGerencia(file: File): Promise<any> {
    const headers = this.headers;
    const formData = new FormData();
    formData.append('FileData', file);
    return this.http.post(this.apiUrl + '/UploadMassive', formData, { headers }).toPromise();
  }

  getPaginatedGerencias(page: number, pageSize: number): Promise<any> {
    const headers = this.headers;
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return this.http.get(this.apiUrl + '/paginated', { params, headers }).toPromise();
  }


    private createJsonHeaders(): HttpHeaders {
        const headers = this.createHeaders();
        return headers.set('Content-Type', 'application/json');
      }
      crearGerencia(name: string): Promise<any> {
        if (!name || name.trim() === '') {
          return Promise.reject(new Error('El nombre de la gerencia no puede estar vacío.'));
        }
      
        const headers = this.createJsonHeaders();
        const payload = {
          Name: name.trim(),
        };
      
        return this.http.post(this.apiUrl, payload, { headers }).toPromise()
          .then(response => {
            return response;
          })
          .catch(error => {
            console.error('Error en la creación de gerencia:', error);
            throw error;
          });
      }
      

  eliminarGerencia(id: number): Promise<any> {
    const headers = this.headers;
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).toPromise();
  }

  modificarGerencia(gerencia: { id: number; name: string; active: boolean }): Promise<any> {
    if (!gerencia.name || gerencia.name.trim() === '') {
      return Promise.reject(new Error('El nombre de la gerencia no puede estar vacío.'));
    }

    const headers = this.createHeaders();
    const payload = {
      id: gerencia.id,
      Name: gerencia.name.trim(),
      Active: gerencia.active,
    };


    return this.http.put(this.apiUrl, payload, { headers }).toPromise()
      .then(response => {
        return response;
      })
      .catch(error => {
        console.error('Error en la modificación de gerencia:', error);
        throw error;
      });
  }
}
