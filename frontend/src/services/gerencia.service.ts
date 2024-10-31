import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';


@Injectable({
  providedIn: 'root',
})
export class GerenciaService {
  private apiUrl = environment.apiUrl+"/leadership";  

  constructor(private http: HttpClient) {}

  uploadMissiveGerencia(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('FileData', file);
    return this.http.post(this.apiUrl + '/UploadMassive', formData).toPromise();
  }

  getPaginatedGerencias(page: number, pageSize: number): Promise<any> {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return this.http.get(this.apiUrl + '/paginated', { params }).toPromise();
  }
  crearGerencia(nombreGerencia: string, active: boolean): Promise<any> {
    const formData = new FormData();
    formData.append('Name', nombreGerencia);
    formData.append('Active', active.toString());  
  
    return this.http.post(this.apiUrl, formData).toPromise(); 
  }
  
  
  eliminarGerencia(id: number): Promise<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).toPromise();  
  }

  modificarGerencia(gerencia: { id: number; name: string; active: boolean }): Promise<any> {
    const payload = {
      id: gerencia.id,     
      name: gerencia.name, 
      active: gerencia.active,  
    };
  
    console.log('Modificando gerencia con payload:', payload);
  
    return this.http.put(this.apiUrl, payload).toPromise()
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
