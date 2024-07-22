import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrandModel, IProduct } from '../../models/product/IProductRequest';
import { Observable } from 'rxjs';
import { IResponseData } from './../../models/IResponse-data.model';
import { createRequestOptions } from "../../helpers/RequestOptions";
import { BrandRequest } from 'src/app/models/brand/brand-request';

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    constructor(private httpClient: HttpClient) {
    }
    private baseUrl = `${environment.APIURL}`

    create(payload: IProduct): Observable<IResponseData<any>> {
        return this.httpClient.post<any>(this.baseUrl + '/cms/product', payload)
    }

    getAll(param: string): Observable<any> {
        const options = createRequestOptions({
            params: { keyword: param },
        });
        return this.httpClient.get<any>(this.baseUrl + `/cms/product`, options);
    }

    getById(id: string): Observable<any> {
        return this.httpClient.get<any>(this.baseUrl + `/cms/product/${id}`);
    }

    edit(payload: IProduct): Observable<any> {
        return this.httpClient.put<any>(this.baseUrl + `/cms/product/`, payload);
    }

    delete(id: string): Observable<any> {
        return this.httpClient.delete<any>(this.baseUrl + `/cms/product/${id}`);
    }

    createBrand(rq: BrandModel): Observable<IResponseData<any>> {
        return this.httpClient.post<any>(this.baseUrl + '/cms/brand', rq)
    }

    getALlBrand(rq: BrandRequest): Observable<any> {
        const options = createRequestOptions({
            params: rq,
        });
        return this.httpClient.get<any>(`${this.baseUrl}/cms/brand`, options);
    }

    getBrandById(id: number): Observable<IResponseData<any>> {
        return this.httpClient.get<any>(`${this.baseUrl}/cms/brand/${id}`);
    }

    editBrand(rq: BrandModel): Observable<IResponseData<any>> {
        return this.httpClient.put<any>(this.baseUrl + '/cms/brand', rq)
    }

    deleteBrand(id: number): Observable<any> {
        return this.httpClient.delete<any>(this.baseUrl + `/cms/brand/${id}`);
    }
}