import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IpService {
  private ipApiUrl = 'https://api64.ipify.org?format=json';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la dirección IP pública del usuario.
   * @returns Observable con la respuesta que incluye la IP.
   */
  getPublicIp(): Observable<any> {
    return this.http.get(this.ipApiUrl); // Respuesta esperada: { ip: 'xx.xx.xx.xx' }
  }
}
