import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environment/environment';



@Injectable({ providedIn: 'root' })
export class SegmentService {
    constructor(private _httpClient: HttpClient, ) { }
   

    uploadMissiveSegment(file: any): Promise<any> {

        const formData = new FormData();
        formData.append("fileData", file);

        return lastValueFrom(this._httpClient.put(
            `${environment.apiUrl}/segment/UpdateMassive/`, formData
        ));
    }

 
}
