import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ContactUsService {
    constructor(private httpClient: HttpClient) {
    }
    private baseUrl = `${environment.APIURL}`

    getQuestion(lang: string):Observable<any> {
        return this.httpClient.get(`${this.baseUrl}/question-title/${lang}`)
    }
}