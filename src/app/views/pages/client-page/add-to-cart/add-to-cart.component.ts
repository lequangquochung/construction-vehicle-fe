import { UpperCasePipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrl: 'add-to-cart.component.scss',
  standalone: true,
  imports: [UpperCasePipe, NgFor, FontAwesomeModule]
})
export class AddToCartComponent implements OnInit {
  faIcon = {
    faCartPlus: faCartPlus,
    faTrash: faTrash
  }

  cartProducts: any[] = [];

  STORAGE_KEY = "cartItem";

  ngOnInit(): void {
    this.getCartItems();
  }

  removeItem(id: string) {
    let data = this.cartProducts.filter(item => item.id != id);
    this.cartProducts = data;
    this.saveStorage(this.STORAGE_KEY, JSON.stringify(this.cartProducts));
  }

  saveStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    this.getCartItems();
  }

  getCartItems() {
    const value = localStorage.getItem(this.STORAGE_KEY);
    let data: [] = value ? JSON.parse(value) : [];

    console.log('data',data);

    // let uniqueArray = data.filter((item: any, index, self) =>
    //   index === self.findIndex((t: any) => t.id === item.id)
    // );

    console.log(this.checkDuplicateCartItem(data));


    // this.cartProducts = [...uniqueArray];
    // console.log(this.cartProducts);


  }

  checkDuplicateCartItem(arr: any) {
    let result =  [...new Set(arr)];
    // let result = arr?.reduce((acc: any, item: any) => {
    //   if (acc.indexOf(item) === -1) {
    //     acc.push(item);
    //   }
    //   return acc;
    // });
    return result; 
  }
}
