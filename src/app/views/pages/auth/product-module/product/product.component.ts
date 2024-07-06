import { ProductService } from './../../../../../services/product/product.service';
import { FileService } from 'src/app/services/file/file.service';
import { Description, IProductRequest, ProductName } from './../../../../../models/product/IProductRequest';
import { NgFor } from '@angular/common';
import { EPRODUCT_TYPE } from './../../../../../enum/EProduct';
import { CategoryService } from './../../../../../services/category/category.service';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerModule, TextColorDirective, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { ColorsToast } from 'src/app/enum/colors';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: 'product.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, FormsModule, SpinnerModule,
    TextColorDirective,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent,
  ]
})
export class ProductComponent implements OnInit {

  positions = Object.values(ToasterPlacement);
  position = ToasterPlacement.TopEnd;
  positionStatic = ToasterPlacement.BottomEnd;
  toastColors = ColorsToast.success;
  autoHide = true;
  delay = 3000;
  fade = true;
  isShowToast = false;

  selectedFiles: File[] = new Array();
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
    private fileService: FileService,
    private productService: ProductService
  ) { }
  ngOnInit(): void {
    this.getCategory();
  }

  submitForm() {
    const formData: FormData = new FormData();
    Array.from(this.selectedFiles).forEach((file) => {
      formData.append('files', file, file.name);
    });

    let productName: ProductName = {
      contentEng: this.productForm.get('nameContentEng')?.value!,
      contentVie: this.productForm.get('nameContentVie')?.value!,
    }

    let description: Description = {
      contentEng: this.productForm.get('descriptionEng')?.value!,
      contentVie: this.productForm.get('descriptionVie')?.value!,
    }

    let request: IProductRequest = {
      name: productName,
      categoryId: parseInt(this.productForm.get('categoryId')?.value!),
      description: description,
      model: this.productForm.get('model')?.value!,
      contact: this.productForm.get('contact')?.value!,
      price: this.productForm.get('price')?.value!,
      amount: this.productForm.get('amount')?.value!,
      type: this.productForm.get('type')?.value!,
      gallery: []
    }

    this.fileService.uploadMultiple(formData!).subscribe({
      next: (res) => {
        request.gallery = res.data;
        this.createProduct(request);
      }
    })
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    for (let i = 0; i < event.target.files; i++) {
      this.selectedFiles.push(event.target.files[i]);
    };
  }

  private getCategory() {
    this.categoryService.getAll(this.keyword).subscribe({
      next: (res) => {
        this.categoryType = res.data.data;
      }
    })
  }

  createProduct(payload: IProductRequest) {
    this.productService.create(payload).subscribe({
      next: (res) => {
        console.log('create', res);
        this.isShowToast = true;
      },
      error: (error: Error) => {
        
      }

    })
  }
}
