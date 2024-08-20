import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { createRequestOptions } from "../../../helpers/RequestOptions";
import { environment } from './../../../../environments/environment';
import { ClientProductRequest } from 'src/app/models/product/ClientProductRequest';
import { ICartOrderRequest } from 'src/app/models/cartOrder/cartOrderRequest';
import { IResponseData } from 'src/app/models/IResponse-data.model';
import { BrandModel } from 'src/app/models/product/IProductRequest';
import { IContactUS } from 'src/app/models/contact-us/IContactUs';
@Injectable({
    providedIn: 'root'
})

export class ProductClientService {
    constructor(private httpClient: HttpClient) {
    }
    private baseUrl = `${environment.APIURL}`

    private keywordService = new Subject<string>();
    private changeLanguage = new Subject<boolean>();
    keywordService$ = this.keywordService.asObservable();
    changeLanguage$ = this.changeLanguage.asObservable();

    changeLang(changed: boolean) {
        this.changeLanguage.next(changed);
    }

    sendKeyword(message: string) {
        this.keywordService.next(message);
    }

    getAll(param: ClientProductRequest, lang: string): Observable<any> {
        const options = createRequestOptions({
            params: param,
        });
        return this.httpClient.get<any>(this.baseUrl + `/product/${lang}`, options);
    }

    getById(id: string, lang: string): Observable<any> {
        return this.httpClient.get<any>(this.baseUrl + `/product/${id}/${lang}/`);
    }

    createOrder(rq: ICartOrderRequest): Observable<IResponseData<any>> {
        return this.httpClient.post<any>(this.baseUrl + '/order', rq)
    }

    createContactRequest(rq: IContactUS): Observable<IResponseData<any>> {
        return this.httpClient.post<any>(this.baseUrl + '/question', rq)
    }

    getAllBrands(language: string): Observable<IResponseData<any>> {
        return this.httpClient.get<IResponseData<IResponseData<BrandModel[]>>>(this.baseUrl + `/brand/${language}`);
    }

    getSideBar(type: string, lang: string): Observable<any> {
        const options = createRequestOptions({
            params: type,
        });
        return this.httpClient.get<any>(this.baseUrl + `/category/side-bar/${lang}`, options);
    }
}