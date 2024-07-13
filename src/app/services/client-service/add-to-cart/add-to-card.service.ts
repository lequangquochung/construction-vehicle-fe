import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AddToCartService {
    private dataSubject = new Subject<any>();
    STORAGE_KEY = "cartItem";
    data$ = this.dataSubject.asObservable();

    sendData(data: any) {
        this.dataSubject.next(data);
      }

      getCartItem(): Array<any> {
        const value = localStorage.getItem(this.STORAGE_KEY);
        let data: [] = value ? JSON.parse(value) : [];
        return data;
      }

      saveItem(data: any) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      }
}