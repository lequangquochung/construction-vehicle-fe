import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { CategoryClientRequest } from 'src/app/models/category/category-client-request';
import { createRequestOptions } from "../../../helpers/RequestOptions";
import { environment } from './../../../../environments/environment';
@Injectable({
    providedIn: 'root'
})

export class CategoryClientService {
    constructor(private httpClient: HttpClient) {
    }
    private baseUrl = `${environment.APIURL}`

    getAll(param: CategoryClientRequest): Observable<any> {
        const options = createRequestOptions({
            params: param,
        });
        return this.httpClient.get<any>(this.baseUrl + `/category/vi`, options);
    }

    getSideBar() {
        
    }

    
}