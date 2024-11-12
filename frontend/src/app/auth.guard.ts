import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private http: HttpClient) {}

  canActivate(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}/auth/validate-session`, { withCredentials: true })
      .pipe(
        map(() => true), 
        catchError(() => {
          this.router.navigate(['/']);
          return [false];
        })
      );
  }
}
