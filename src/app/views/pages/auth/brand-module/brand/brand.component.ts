import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, SpinnerModule } from '@coreui/angular';
import { BrandModel } from 'src/app/models/product/IProductRequest';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductService } from './../../../../../services/product/product.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrl: 'brand.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule, NgFor, FormsModule, SpinnerModule,
  ],
  
})
export class BrandComponent implements OnInit {
  // BrandModel
  keyword: string = '';
  categoryList: any = [];
  brandForm = this.fb.group({
    contentEng: ['', Validators.required],
    contentVie: ['', Validators.required],
    categoryId: [1, Validators.required]
  });

  visibleForm = {
    edit: false,
    delete: false
  };

  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {

  }
  ngOnInit(): void {
    this.getCategoryByBrand(this.keyword);
  }

  getCategoryByBrand(keyword: string) {
    this.categoryService.getAll(keyword).subscribe({
      next: (res) => {
        this.categoryList = res.data.data;
      }
    })
  }

  createBrand() {
    let rq: BrandModel = {
      name: {
        contentEng: this.brandForm.get('contentEng')?.value!,
        contentVie: this.brandForm.get('contentVie')?.value!
      },
      categoryId: this.brandForm.get('categoryId')?.value!
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
      }
    })
  }
}
