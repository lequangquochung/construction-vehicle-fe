import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AddToCartService {
  private dataSubject = new Subject<any>();
  private isChangedData = new Subject<boolean>();
  STORAGE_KEY = "cartItem";
  data$ = this.dataSubject.asObservable();
  isChangedData$ =this.isChangedData.asObservable();

  sendData(data: any) {
    this.dataSubject.next(data);
    
  }

  isChangedCartItem(isChanged: boolean) {
    this.isChangedData.next(isChanged);
  } 

  getCartItem(): Array<any> {
    const value = localStorage.getItem(this.STORAGE_KEY);
    let data: [] = value ? JSON.parse(value) : [];
    return data;
  }

  addItem(data: any) {
    let cartItems: Array<any> = this.getCartItem();
    cartItems.concat(data);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  editItem(data: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    this.isChangedCartItem(true);
  }
}