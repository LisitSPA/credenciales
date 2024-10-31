import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment/environment';


@Injectable({
  providedIn: 'root',
})
export class GerenciaService {
  private apiUrl = environment.apiUrl+"/leadership";  
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  uploadMissiveGerencia(file: File): Promise<any> {
    let headers = this.headers;
    const formData = new FormData();
    formData.append('FileData', file);
    return this.http.post(this.apiUrl + '/UploadMassive', formData, {headers}).toPromise();
  }

  getPaginatedGerencias(page: number, pageSize: number): Promise<any> {
    let headers = this.headers;
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return this.http.get(this.apiUrl + '/paginated', { params, headers }).toPromise();
  }
  crearGerencia(nombreGerencia: string, active: boolean): Promise<any> {
    let headers = this.headers;
    const formData = new FormData();
    formData.append('Name', nombreGerencia);
    formData.append('Active', active.toString());  
  
    return this.http.post(this.apiUrl, formData, {headers}).toPromise(); 
  }
  
  
  eliminarGerencia(id: number): Promise<any> {
    let headers = this.headers;
    return this.http.delete(`${this.apiUrl}/${id}`, {headers}).toPromise();  
  }

  modificarGerencia(gerencia: { id: number; name: string; active: boolean }): Promise<any> {
    let headers = this.headers;
    const payload = {
      id: gerencia.id,     
      name: gerencia.name, 
      active: gerencia.active,  
    };
  
    console.log('Modificando gerencia con payload:', payload);
  
    return this.http.put(this.apiUrl, payload, {headers}).toPromise()
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
