import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, SpinnerModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { NgxImageCompressService, UploadResponse } from 'ngx-image-compress';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FileService } from 'src/app/services/file/file.service';
import { EPRODUCT_TYPE } from './../../../../../enum/EProduct';
import { BrandRequest } from './../../../../../models/brand/brand-request';
import { BrandModel, Description, IProduct, ProductName } from './../../../../../models/product/IProductRequest';
import { CategoryService } from './../../../../../services/category/category.service';
import { ProductService } from './../../../../../services/product/product.service';
import { E_STATUS, MAX_SIZE } from 'src/app/enum/ESTATUS';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: 'product.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule,
    NgIf, NgFor, FormsModule, SpinnerModule,
    ToastModule,
    FontAwesomeModule,
    ModalComponent, ModalHeaderComponent, ModalTitleDirective,
    ModalBodyComponent, ModalFooterComponent,
    DialogModule
  ],
  providers: [MessageService, NgxImageCompressService]
})
export class ProductComponent implements OnInit {

  @ViewChild('inputFiles') inputFiles!: ElementRef;
  isLoading: boolean = false;

  faIcon = {
    faClose: faClose
  }

  visibleForm = {
    gallery: false,
    warning: false
  }
  galleryItemId?: number = undefined;


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

  totalFileSize: number = 0;
  imgResultMultiple: UploadResponse[] = [];
  isMaxSize: boolean = false;

  imgResultBeforeCompression: string = "";
  imgResultAfterCompression: string = "";
  MIMETYPE = {
    'data:image/png;base64': 'image/png',
    'data:image/jpeg;base64': 'image/jpeg',
    'data:application/pdf;base64': 'application/pdf',
    'data:image/webp;base64': 'image/webp',
    'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private fileService: FileService,
    private productService: ProductService,
    private messageService: MessageService,
    private imageCompress: NgxImageCompressService
  ) { }
  ngOnInit(): void {
    this.getCategory();
    this.getBrands(this.brandRequest);
  }

  submitForm() {
    const formData: FormData = new FormData();
    this.selectedFiles = [];
    this.imgResultMultiple.forEach((item) => {
      this.selectedFiles.push(this.base64ToFile(item.image, item.fileName));
    });

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

  toggleDeleteGallery(index?: number) {
    this.visibleForm.gallery = !this.visibleForm.gallery;
    this.galleryItemId = index;
  }

  handleDeleteGallery() {
    if (this.galleryItemId! > -1) {
      this.imgResultMultiple.splice(this.galleryItemId!, 1);
    }
    this.visibleForm.gallery = false;
  }

  uploadMultipleFiles() {
    return this.imageCompress.uploadMultipleFiles().then((multipleOrientedFiles: UploadResponse[]) => {
      this.totalFileSize = 0;
      this.imgResultMultiple = multipleOrientedFiles;
      this.imgResultMultiple.forEach((item) => {
        this.totalFileSize += this.base64ToFile(item.image, item.fileName).size;
        this.isMaxSize = this.isMaxSizeUpload(this.totalFileSize ?? 0);
        if (this.isMaxSize) {
          this.visibleForm.warning = true;
          this.imgResultMultiple = [];
        }
      });
    });
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
          this.productForm.reset();
          // this.inputFiles.nativeElement.value = null;
          this.imgResultMultiple = [];
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

  private base64ToFile(base64String: string, fileName: string) {
    // Determine the MIME type based on the Base64 string
    const mimeType = this.getMimeType(base64String);

    // Decode Base64 to binary data
    const byteCharacters = atob(base64String.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob and File from the binary data
    const blob = new Blob([byteArray], { type: mimeType });
    return new File([blob], fileName, { type: mimeType });
  }

  private getMimeType(base64String: string): string {
    const mimeTypeMap: any = this.MIMETYPE;

    // Extract the prefix to determine the MIME type
    const prefix = base64String.split(',')[0];
    return mimeTypeMap[prefix] || 'application/octet-stream'
  }

  private isMaxSizeUpload(fileSize: number): boolean {
    return MAX_SIZE.MAX_UPLOAD_SIZE < fileSize;
  }
}
