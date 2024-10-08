import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerModule } from '@coreui/angular';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BrandModel } from 'src/app/models/product/IProductRequest';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductService } from './../../../../../services/product/product.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrl: 'brand.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule, NgFor, FormsModule,
    SpinnerModule, ToastModule, NgIf
  ],
  providers: [MessageService]

})
export class BrandComponent implements OnInit {
  isLoading: boolean = false;
  brandForm = this.fb.group({
    contentEng: ['', Validators.required],
    contentVie: ['', Validators.required],
  });

  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {

  }
  ngOnInit(): void { }

  createBrand() {
    this.isLoading = true;
    let rq: BrandModel = {
      name: {
        contentEng: this.brandForm.get('contentEng')?.value!,
        contentVie: this.brandForm.get('contentVie')?.value!
      },
    }
    this.productService.createBrand(rq).subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add(
            { severity: 'success', summary: '', detail: 'Successfully' },
          );
          this.brandForm.reset();
        }
      },
      error: () => {
        this.messageService.add(
          { severity: 'error', summary: '', detail: 'Failed' }
        )
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }
}
