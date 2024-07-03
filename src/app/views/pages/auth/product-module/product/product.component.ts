import { FileService } from 'src/app/services/file/file.service';
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
    private categoryService: CategoryService,
    private fileService: FileService
  ) { }
  ngOnInit(): void {
    this.getCategory();
  }

  submitForm() {
    // console.log(this.productForm.value);
    const formData: FormData = new FormData();
    this.selectedFiles.forEach((file, index) => {
      formData.append('files', file, file.name);
    });
    this.fileService.uploadMultiple(formData!)
    
    let productName: ProductName = {
      contentEng: this.productForm.get('nameContentEng')?.value!,
      contentVie: this.productForm.get('nameContentVie')?.value!,
    }

    let description: Description = {
      contentEng: "",
      contentVie: "undefined"
    }

    const request: IProductRequest = {
      name: productName,
      categoryId: '',
      description:description,
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
