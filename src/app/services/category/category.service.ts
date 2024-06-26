import { IResponseData } from './../../models/IResponse-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { Observable } from "rxjs/internal/Observable";
import { CategoryRequestModel } from '../../models/category/category-request.model';
import { createRequestOptions } from "src/app/helpers/RequestOptions";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private httpClient: HttpClient) {
    }
    private baseUrl = `${environment.APIURL}`

    create(payload: CategoryRequestModel): Observable<IResponseData<any>> {
        return this.httpClient.post<any>(this.baseUrl + '/cms/category', payload)
    }

    getAll(param: string): Observable<any> {
        const options = createRequestOptions({
            params: { keyword: param },
        });
        return this.httpClient.get<any>(this.baseUrl + `cms/category`, options);
    }

    getById(id: string): Observable<any> {
        return this.httpClient.get<any>(this.baseUrl + `cms/category/${id}`);
    }

    edit(id: string, payload: CategoryRequestModel): Observable<any> {
        return this.httpClient.put<any>(this.baseUrl + `/cms/category/${id}`, payload);
    }

    delete(id: string): Observable<any> {
        return this.httpClient.delete<any>(this.baseUrl + `cms/category/${id}`);
    }
}