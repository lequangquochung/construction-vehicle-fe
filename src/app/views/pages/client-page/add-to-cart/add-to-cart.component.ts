import { NgFor, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DetailCartItem, ICartOrderRequest } from 'src/app/models/cartOrder/cartOrderRequest';
import { AddToCartService } from 'src/app/services/client-service/add-to-cart/add-to-card.service';
import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrl: 'add-to-cart.component.scss',
  standalone: true,
  imports: [UpperCasePipe, NgFor, FontAwesomeModule, FormModule, ReactiveFormsModule, ToastModule],
  providers: [MessageService]
})
export class AddToCartComponent implements OnInit {
  orderForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    phoneNumber: ['', [Validators.required]],
    textContent: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private addToCartService: AddToCartService,
    private messageService: MessageService,
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
    let arrDetail: DetailCartItem[] = [];
    this.addToCartService.getCartItem().map((item: any) => {
      arrDetail.push({
        productId: item.id,
        amount: 1,
        price: item.price
      })
    });

    let rq: ICartOrderRequest = {
      email: this.orderForm.get('email')?.value!,
      phoneNumber: this.orderForm.get('phoneNumber')?.value!,
      note: this.orderForm.get('textContent')?.value!,
      name: this.orderForm.get('name')?.value!,
      details: arrDetail
    }

    this.productClientService.createOrder(rq).subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add(
            { severity: 'success', summary: '', detail: 'Gửi Thành Công' },
          );
          this.orderForm.reset();
        }
      },
      error: () => {
        this.messageService.add(
          { severity: 'error', summary: '', detail: 'Gửi Thất Bại' }
        )
      }
    })
  }
}
