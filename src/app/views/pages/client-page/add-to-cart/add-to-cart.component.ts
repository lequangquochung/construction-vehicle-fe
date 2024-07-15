import { UpperCasePipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AddToCartService } from 'src/app/services/client-service/add-to-cart/add-to-card.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrl: 'add-to-cart.component.scss',
  standalone: true,
  imports: [UpperCasePipe, NgFor, FontAwesomeModule]
})
export class AddToCartComponent implements OnInit {
  constructor(private addToCartService: AddToCartService) {}
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
    this.addToCartService.editItem(data);
    this.getCartItems();
  }

  getCartItems() {
    const value =this.addToCartService.getCartItem();
    this.cartProducts = value;
  }
}
