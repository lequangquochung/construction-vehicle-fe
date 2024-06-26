import { IResponseData } from './../../models/IResponse-data.model';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class FileService {
    constructor(private httpClient: HttpClient) {
    }
    private baseUrl = `${environment.APIURL}`

    uploadSingle(payload: FormData): Observable<IResponseData<any>> {
        return this.httpClient.post<any>(this.baseUrl + 'cms/upload/single', payload);
    }

    uploadMultiple(payload: Array<File>): Observable<IResponseData<any>> {
        return this.httpClient.post<any>(this.baseUrl + 'cms/upload/single', payload);
    }
}