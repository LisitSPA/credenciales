import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SegmentService {
  private apiUrl = 'http://localhost:5002/api/segment';

  constructor(private http: HttpClient) {}

  uploadMissiveSegment(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('FileData', file);
    return this.http.post(`${this.apiUrl}/UploadMassive`, formData).pipe(
      catchError(error => {
        console.error('Error al subir el segmento masivo:', error);
        return throwError(error);
      })
    );
  }

  getPaginatedSegments(page: number, pageSize: number): Observable<any> {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return this.http.get(`${this.apiUrl}/paginated`, { params }).pipe(
      catchError(error => {
        console.error('Error al obtener los segmentos paginados:', error);
        return throwError(error);
      })
    );
  }

  createSegment(nombreSegmento: string, colorSegmento: string, estadoSegmento: boolean): Observable<any> {
    const formData = new FormData();
    formData.append('Description', nombreSegmento);
    formData.append('Color', colorSegmento);
    formData.append('Active', estadoSegmento.toString());

    return this.http.post(`${this.apiUrl}`, formData).pipe(
      catchError(error => {
        console.error('Error en la creación del segmento en el servidor:', error);
        return throwError(error);
      })
    );
  }

  deleteSegment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar el segmento:', error);
        return throwError(error);
      })
    );
  }
}
