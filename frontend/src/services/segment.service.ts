import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SegmentService {
  private apiUrl = environment.apiUrl+"/segment";  

  constructor(private http: HttpClient) {}

  uploadMissiveSegment(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('FileData', file);
    return this.http.post(`${this.apiUrl}/UploadMassive`, formData).toPromise();
  }

  
  getPaginatedSegments(page: number, pageSize: number): Promise<any> {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return this.http.get(`${this.apiUrl}/paginated`, { params }).toPromise();
  }


createSegment(nombreSegmento: string, colorSegmento: string, estadoSegmento: boolean): Promise<any> {
  const formData = new FormData();
  formData.append('Description', nombreSegmento);
  formData.append('Color', colorSegmento);
  formData.append('Active', estadoSegmento.toString());

  return this.http.post(`${this.apiUrl}`, formData).toPromise().then(response => {
    console.log('Respuesta del servidor:', response);
    return response;
  }).catch(error => {
    console.error('Error en la creación del segmento en el servidor:', error);
    throw error;
  });
}


deleteSegment(id: number): Promise<any> {
  return this.http.delete(`${this.apiUrl}/${id}`).toPromise();
}

}







