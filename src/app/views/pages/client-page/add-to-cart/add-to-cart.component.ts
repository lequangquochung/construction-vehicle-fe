import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';
import { UpperCasePipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ICartOrderRequest } from 'src/app/models/cartOrder/cartOrderRequest';
import { AddToCartService } from 'src/app/services/client-service/add-to-cart/add-to-card.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrl: 'add-to-cart.component.scss',
  standalone: true,
  imports: [UpperCasePipe, NgFor, FontAwesomeModule, FormModule, ReactiveFormsModule]
})
export class AddToCartComponent implements OnInit {
  orderForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    phoneNumber: ['', [Validators.required]],
    textContent: ['', [Validators.required]],
    category: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private addToCartService: AddToCartService,
    private productClientService: ProductClientService) { }
  faIcon = {
    faCartPlus: faCartPlus,
    faTrash: faTrash
  }
  cartProducts: any[] = [];

  ngOnInit(): void {
    this.getCartItems();
  }

  removeItem(id: string) {
    let data = this.cartProducts.filter(item => item.id != id);
    this.addToCartService.editItem(data);
    this.getCartItems();
  }

  getCartItems() {
    const value = this.addToCartService.getCartItem();
    this.cartProducts = value;
  }

  submit() {
    let cartItems = this.addToCartService.getCartItem();
    console.log(cartItems);

    let rq: ICartOrderRequest = {
      email: this.orderForm.get('email')?.value!,
      phoneNumber: this.orderForm.get('email')?.value!,
      note: this.orderForm.get('email')?.value!,
      name: this.orderForm.get('email')?.value!,
      details: cartItems
    }
    console.log(rq);
    
    // this.productClientService.createOrder(rq).subscribe({
    //   next: (res) => {
    //     if(res.success) {
          
    //     }
    //   }
    // })
  }
}
