import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule, SpinnerModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressBook, faPager, faParking, faPhone } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AddToCartService } from 'src/app/services/client-service/add-to-cart/add-to-card.service';
import { IContactUS } from './../../../../models/contact-us/IContactUs';
import { ContactUsService } from './../../../../services/client-service/contact-us/contact-us.service';
import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: 'contact-us.component.scss',
  standalone: true,
  imports: [ToastModule, FontAwesomeModule, SpinnerModule, FormModule, ReactiveFormsModule, NgFor],
  providers: [MessageService]
})
export class ContactUsComponent implements OnInit {
  faParking = faParking;
  faAddressBook = faAddressBook;
  faPhone = faPhone;
  faPager = faPager;
  isShowSpinner: boolean = true;
  // ICartOrderRequest
  contactForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    phoneNumber: ['', [Validators.required]],
    content: ['', [Validators.required]],
    titleId: [1, Validators.required]
  })
  lang: string = "vi"
  question: any[] = [];
  constructor(
    private fb: FormBuilder,
    private addToCartService: AddToCartService,
    private contactUsService: ContactUsService,
    private productClientService: ProductClientService,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    setTimeout(() => {
      this.isShowSpinner = false;
    }, 2000);
    this.getQuestion(this.lang);
  }

  getQuestion(lang: string) {
    this.contactUsService.getQuestion(lang).subscribe({
      next: (res) => {
        this.question = res.data.titles;
      }
    });
  }

  submit() {
    let rq: IContactUS = {
      email: this.contactForm.get('email')?.value!,
      phoneNumber: this.contactForm.get('phoneNumber')?.value!,
      content: this.contactForm.get('content')?.value!,
      fullName: this.contactForm.get('fullName')?.value!,
      titleId: +this.contactForm.get('titleId')?.value!,
    }

    this.productClientService.createContactRequest(rq).subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add(
            { severity: 'success', summary: '', detail: 'Successfully' },
          );
          this.contactForm.reset();
          this.contactForm.get('titleId')?.setValue(1);
        };
      },
      error: () => {
        this.messageService.add(
          { severity: 'error', summary: '', detail: 'Failed' }
        );
      },
    });
  }

}
