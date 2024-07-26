import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderRequest } from '../../models/order/orderRequest';
import { Observable } from 'rxjs';
import { createRequestOptions } from "../../helpers/RequestOptions";
import { IResponseData } from './../../models/IResponse-data.model';
@Injectable({
    providedIn: 'root'
})

export class OrderService {
    constructor(private httpClient: HttpClient) {
    }
    private baseUrl = `${environment.APIURL}`

    getAll(rq: OrderRequest): Observable<any> {
        const options = createRequestOptions({
            params: rq,
        });
        return this.httpClient.get<IResponseData<any[]>>(`${this.baseUrl}/cms/order`, options);
    }
}