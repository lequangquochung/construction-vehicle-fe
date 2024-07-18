import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule, SpinnerModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressBook, faPager, faParking, faPhone } from '@fortawesome/free-solid-svg-icons';

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
  // contactForm = this.fb.group({
  //   name: ['', Validators.required],
  //   email: ['', Validators.email, Validators.required],
  //   phoneNumber: ['', Validators.required],
  //   textContent: ['', Validators.required],
  //   category: ['', Validators.required]
  // })
  constructor(
    private fb: FormBuilder
  ){}
  ngOnInit(): void {
    setTimeout(() => {
      this.isShowSpinner = false;
    }, 2000);
  }

  submit() {

  }

}
