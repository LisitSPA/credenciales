import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environment/environment';



@Injectable({ providedIn: 'root' })
export class GerenciaService {
    constructor(private _httpClient: HttpClient, ) { }
   

    uploadMissiveLeadership(file: any): Promise<any> {

        const formData = new FormData();
        formData.append("fileData", file);

        return lastValueFrom(this._httpClient.put(
            `${environment.apiUrl}/leadership/UpdateMassive/`, formData
        ));
    }

 
}
