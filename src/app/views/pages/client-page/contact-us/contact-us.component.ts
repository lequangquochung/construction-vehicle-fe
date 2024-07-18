import { ICartOrderRequest } from './../../../../models/cartOrder/cartOrderRequest';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule, SpinnerModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressBook, faPager, faParking, faPhone } from '@fortawesome/free-solid-svg-icons';
import { AddToCartService } from 'src/app/services/client-service/add-to-cart/add-to-card.service';
import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: 'contact-us.component.scss',
  standalone: true,
  imports: [FontAwesomeModule, SpinnerModule, FormModule, ReactiveFormsModule]
})
export class ContactUsComponent implements OnInit {
  faParking = faParking;
  faAddressBook = faAddressBook;
  faPhone = faPhone;
  faPager= faPager;
  isShowSpinner: boolean = true;
  // ICartOrderRequest
  contactForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    phoneNumber: ['', [Validators.required]],
    textContent: ['', [Validators.required]],
    category: ['', [Validators.required]]
  })
  constructor(
    private fb: FormBuilder,
    private productClientService: ProductClientService,
    private addToCartService: AddToCartService
  ){}
  ngOnInit(): void {
    setTimeout(() => {
      this.isShowSpinner = false;
    }, 2000);
  }
  
  submit() {
    let cartItems = this.addToCartService.getCartItem();
    console.log(cartItems);
    
    let rq: ICartOrderRequest = {
      email: this.contactForm.get('email')?.value!,
      phoneNumber: this.contactForm.get('email')?.value!,
      note: this.contactForm.get('email')?.value!,
      name: this.contactForm.get('email')?.value!,
      details: []
    }

    // this.productClientService.createOrder(rq).subscribe({
    //   next: (res) =>{
    //     if(res.success) {

    //     }
    //   }
    // });
  }

}
