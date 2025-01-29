import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../environment/environment';
import { IpService } from './ip.service';

@Injectable({
  providedIn: 'root',
})
export class TermsService {
  private apiUrl = `${environment.apiUrl}/collaborators`;

  constructor(private http: HttpClient, private ipService: IpService) {}

  acceptTerms(id: number, aceptaTerminos: boolean): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No se encontró un token de autenticación.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.ipService.getPublicIp().pipe(
      switchMap((ipResponse: any) => {
        const body = {
          id,
          AceptaTerminos: aceptaTerminos,
          IP: ipResponse.ip,
        };

        return this.http.post(`${this.apiUrl}/TerminoyCondiciones`, body, {
          headers,
        });
      })
    );
  }
}
