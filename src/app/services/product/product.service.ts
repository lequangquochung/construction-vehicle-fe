import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProductRequest } from '../../models/product/IProductRequest';
import { Observable } from 'rxjs';
import { IResponseData } from './../../models/IResponse-data.model';
import { createRequestOptions } from "../../helpers/RequestOptions";

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    constructor(private httpClient: HttpClient) {
    }
    private baseUrl = `${environment.APIURL}`

    create(payload: IProductRequest): Observable<IResponseData<any>> {
        return this.httpClient.post<any>(this.baseUrl + '/cms/product', payload)
    }

    getAll(param: string): Observable<any> {
        const options = createRequestOptions({
            params: { keyword: param },
        });
        return this.httpClient.get<any>(this.baseUrl + `/cms/product`, options);
    }
}