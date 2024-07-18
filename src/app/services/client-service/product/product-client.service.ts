import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { createRequestOptions } from "../../../helpers/RequestOptions";
import { environment } from './../../../../environments/environment';
import { ClientProductRequest } from 'src/app/models/product/ClientProductRequest';
import { ICartOrderRequest } from 'src/app/models/cartOrder/cartOrderRequest';
import { IResponseData } from 'src/app/models/IResponse-data.model';
@Injectable({
    providedIn: 'root'
})

export class ProductClientService {
    constructor(private httpClient: HttpClient) {
    }
    private baseUrl = `${environment.APIURL}`

    getAll(param: ClientProductRequest): Observable<any> {
        const options = createRequestOptions({
            params: param,
        });
        return this.httpClient.get<any>(this.baseUrl + `/product/vi`, options);
    }

    getById(id: string, lang: string): Observable<any> {
        return this.httpClient.get<any>(this.baseUrl + `/product/${id}/${lang}/`);
    }

    createOrder(rq: ICartOrderRequest): Observable<IResponseData<any>> {
        return this.httpClient.post<any>(this.baseUrl + '/order', rq)
    }
}