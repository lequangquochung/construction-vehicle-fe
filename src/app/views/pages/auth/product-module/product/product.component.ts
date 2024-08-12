import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerModule, TextColorDirective, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent } from '@coreui/angular';
import { FileService } from 'src/app/services/file/file.service';
import { EPRODUCT_TYPE } from './../../../../../enum/EProduct';
import { BrandRequest } from './../../../../../models/brand/brand-request';
import { BrandModel, Description, IProduct, ProductName } from './../../../../../models/product/IProductRequest';
import { CategoryService } from './../../../../../services/category/category.service';
import { ProductService } from './../../../../../services/product/product.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: 'product.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, FormsModule, SpinnerModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class ProductComponent implements OnInit {

  @ViewChild('inputFiles') inputFiles!: ElementRef;
  isLoading: boolean = false;

  selectedFiles: File[] = new Array();
  productForm = this.fb.group({
    nameContentEng: ['', Validators.required],
    nameContentVie: ['', Validators.required],
    categoryId: [1, Validators.required],
    descriptionEng: [''],
    descriptionVie: [''],
    model: [''],
    contact: [''],
    price: [0, Validators.required],
    amount: [0, Validators.required],
    type: [EPRODUCT_TYPE.VEHICLE, Validators.required],

    brandId: [1, Validators.required],
    isHot: [false],
    discount: [0]
  });
  productType = Object.values(EPRODUCT_TYPE);
  categoryType?: any;
  keyword: string = "";
  brands: BrandModel[] = [];
  brandRequest: BrandRequest = {
    keyword: "",
    categoryId: undefined
  }

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private fileService: FileService,
    private productService: ProductService,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    this.getCategory();
    this.getBrands(this.brandRequest);
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
      categoryId: +this.productForm.get('categoryId')?.value!,
      description: description,
      model: this.productForm.get('model')?.value!,
      contact: this.productForm.get('contact')?.value!,
      price: this.productForm.get('price')?.value!,
      amount: this.productForm.get('amount')?.value!,
      type: this.productForm.get('type')?.value!,
      gallery: [],

      isHot: this.productForm.get('isHot')?.value! ?? false,
      discount: +(this.productForm.get('discount')?.value!),
      brandId: +this.productForm.get('brandId')?.value!,
    }

    if (formData) {
      this.fileService.uploadMultiple(formData!).subscribe({
        next: (res) => {
          request.gallery = res.data;
          this.createProduct(request);
        },
        error: (e: Error) => {
          this.messageService.add(
            { severity: 'error', summary: '', detail: 'Lưu Thất Bại' }
          );
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
      error: (e: Error) => { }
    });
  }

  createProduct(payload: IProduct) {
    this.productService.create(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add(
            { severity: 'success', summary: '', detail: 'Lưu Thành Công' },
          );
          this.messageService
          this.productForm.reset();
          this.inputFiles.nativeElement.value = null;
        }
      },
      error: () => {
        this.messageService.add(
          { severity: 'error', summary: '', detail: 'Lưu Thất Bại' }
        );
      },
    });
  }

  private getBrands(brandRequest: BrandRequest) {
    this.productService.getALlBrand(brandRequest).subscribe({
      next: (res) => {
        this.brands = res.data.data;
      }
    });
  }
}
