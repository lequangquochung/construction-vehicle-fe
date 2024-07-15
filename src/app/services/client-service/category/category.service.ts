import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { createRequestOptions } from "../../../helpers/RequestOptions";
import { environment } from './../../../../environments/environment';
import { ClientProductRequest } from 'src/app/models/product/ClientProductRequest';
@Injectable({
    providedIn: 'root'
})

export class CategoryClientService {
    constructor(private httpClient: HttpClient) {
    }
    private baseUrl = `${environment.APIURL}`

    getAll(param: ClientProductRequest): Observable<any> {
        const options = createRequestOptions({
            params: param,
        });
        return this.httpClient.get<any>(this.baseUrl + `/category/vi`, options);
    }

    
}