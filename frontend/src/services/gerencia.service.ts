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
    createGerencia(nombreCompleto: string, active: boolean): Promise<any> {
        try {
          const headers = this.createJsonHeaders(); 
    
          console.log('Valores antes de crear el segmento:');
          console.log('Nombre del segmento:', nombreCompleto);
          console.log('Color del segmento:', active);
    
          const payload = {
            Name: nombreCompleto,
            Active: active,
          };
    
          return this.http.post(`${this.apiUrl}`, payload, { headers }).toPromise()
            .then(response => {
              console.log('Respuesta del servidor:', response);
              return response;
            })
            .catch(error => {
              console.error('Error en la creación de la gerencia en el servidor:', error);
              throw error;
            });
        } catch (error) {
          console.error('Error al intentar crear el encabezado o al crear la gerencia:', error);
          return Promise.reject(error);
        }
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

    console.log('Modificando gerencia con payload:', payload);

    return this.http.put(this.apiUrl, payload, { headers }).toPromise()
      .then(response => {
        console.log('Respuesta de modificación:', response);
        return response;
      })
      .catch(error => {
        console.error('Error en la modificación de gerencia:', error);
        throw error;
      });
  }
}
