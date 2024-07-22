import { NgFor } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerModule, TextColorDirective, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { ColorsToast } from 'src/app/enum/colors';
import { FileService } from 'src/app/services/file/file.service';
import { EPRODUCT_TYPE } from './../../../../../enum/EProduct';
import { BrandModel, Description, IProduct, ProductName } from './../../../../../models/product/IProductRequest';
import { CategoryService } from './../../../../../services/category/category.service';
import { ProductService } from './../../../../../services/product/product.service';

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

  @ViewChild('inputFiles') inputFiles!: ElementRef;
  positionStatic = ToasterPlacement.BottomEnd;
  toastColors = {
    success: ColorsToast.success,
    error: ColorsToast.danger
  };
  autoHide = true;
  delay = 3000;
  fade = true;
  isShowToast = {
    success: false,
    error: false
  }

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

    brandId: [undefined, Validators.required],
    isHot: [false],
    isDiscount: [false]
  });
  productType = Object.values(EPRODUCT_TYPE);
  categoryType?: any;
  keyword: string = "";
  brands: BrandModel[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private fileService: FileService,
    private productService: ProductService
  ) { }
  ngOnInit(): void {
    this.getCategory();
    this.getBrands();
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

    let request: IProduct = {
      name: productName,
      categoryId: parseInt(this.productForm.get('categoryId')?.value!),
      description: description,
      model: this.productForm.get('model')?.value!,
      contact: this.productForm.get('contact')?.value!,
      price: this.productForm.get('price')?.value!,
      amount: this.productForm.get('amount')?.value!,
      type: this.productForm.get('type')?.value!,
      gallery: [],

      isHot: this.productForm.get('isHot')?.value!,
      isDiscount: this.productForm.get('isDiscount')?.value!,
      brandId: this.productForm.get('brandId')?.value!,
    }

    if (formData) {
      this.fileService.uploadMultiple(formData!).subscribe({
        next: (res) => {
          request.gallery = res.data;
          this.createProduct(request);
        },
        error: (e: Error) => {
          this.isShowToast.error = true;
        },
      })
    } else {
      this.createProduct(request);
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
      next: (res) => {
        this.categoryType = res.data.data;
      },
      error: (e: Error) => {
        this.isShowToast.error = true;
      }
    });
  }

  createProduct(payload: IProduct) {
    this.productService.create(payload).subscribe({
      next: (res) => {
        this.isShowToast.success = true;
        this.productForm.reset();
        this.inputFiles.nativeElement.value = null;
      },
      error: (error: Error) => {
        this.isShowToast.error = true;
      },
    });
  }

  private getBrands() {
    this.productService.getALlBrand().subscribe({
      next: (res) => {
        console.log(res);
        this.brands = res.data.data;
      }
    });
  }
}
