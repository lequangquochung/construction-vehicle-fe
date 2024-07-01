import { IProductRequest } from './../../../../../models/product/IProductRequest';
import { NgFor } from '@angular/common';
import { EPRODUCT_TYPE } from './../../../../../enum/EProduct';
import { CategoryService } from './../../../../../services/category/category.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: 'product.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor]
})
export class ProductComponent implements OnInit {
  gallery?: File[];
  productForm = this.fb.group({
    nameContentEng: ['', Validators.required],
    nameContentVie: ['', Validators.required],
    categoryId: ['', Validators.required],
    descriptionEng: [''],
    descriptionVie: [''],
    model: [''],
    contact: [''],
    price: [0, Validators.required],
    amount: [0, Validators.required],
    type: ['string', Validators.required],
  });
  productType = Object.values(EPRODUCT_TYPE);
  categoryType?: any;
  keyword: string = "";
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) { }
  ngOnInit(): void {
    this.getCategory();
  }

  submitForm() {
    console.log(this.productForm.value);
  //   const productName
  //   const request: IProductRequest = {
  //     name: new ProductName,
  //     categoryId: '',
  //     description: new Description,
  //     model: '',
  //     contact: '',
  //     price: 0,
  //     amount: 0,
  //     type: '',
  //     gallery: []
  //   }
  }

  private getCategory() {
    this.categoryService.getAll(this.keyword).subscribe({
      next:(res) => {
        console.log(res);
        this.categoryType =res.data.data;
      }
    })
  }
}
