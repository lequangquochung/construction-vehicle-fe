import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { createRequestOptions } from "../../../helpers/RequestOptions";
import { environment } from './../../../../environments/environment';
@Injectable({
    providedIn: 'root'
})

export class ProductClientService {
    constructor(private httpClient: HttpClient) {
    }
    private baseUrl = `${environment.APIURL}`

    getAll(param: string): Observable<any> {
        const options = createRequestOptions({
            params: { keyword: param },
        });
        return this.httpClient.get<any>(this.baseUrl + `/cms/category`, options);
    }
}