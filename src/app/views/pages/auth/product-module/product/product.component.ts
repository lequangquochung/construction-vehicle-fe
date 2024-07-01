import { Description, IProductRequest, ProductName } from './../../../../../models/product/IProductRequest';
import { NgFor } from '@angular/common';
import { EPRODUCT_TYPE } from './../../../../../enum/EProduct';
import { CategoryService } from './../../../../../services/category/category.service';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerModule } from '@coreui/angular';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: 'product.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, FormsModule, SpinnerModule]
})
export class ProductComponent implements OnInit {
  // gallery?: File[];
  // filesData?: File[];
  selectedFiles: File[] = [];
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
    console.log('filesData', this.selectedFiles);
    
    const productName: ProductName = {
      contentEng: this.productForm.get('nameContentEng')?.value!,
      contentVie: this.productForm.get('nameContentVie')?.value!,
    }

    const description: Description = {
      contentEng: undefined,
      contentVie: undefined
    }

    // const formData: FormData;
    const formData: FormData = new FormData();
    // formData.append('file', this.selectedFiles!);

    const request: IProductRequest = {
      name: new ProductName,
      categoryId: '',
      description: new Description,
      model: '',
      contact: '',
      price: 0,
      amount: 0,
      type: '',
      gallery: []
    }
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    for (let i = 0; i < event.target.files; i++) {
      this.selectedFiles.push(event.target.files[i]);
    };
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
