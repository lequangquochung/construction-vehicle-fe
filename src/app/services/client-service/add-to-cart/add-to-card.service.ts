import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AddToCartService {
    private dataSubject = new Subject<any>();
    data$ = this.dataSubject.asObservable();

    sendData(data: any) {
        this.dataSubject.next(data);
      }
}