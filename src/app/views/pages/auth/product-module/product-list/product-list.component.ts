import { NgFor } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElementRefDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, SpinnerModule, ToastModule, TooltipDirective } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { BrandModel, IProduct } from 'src/app/models/product/IProductRequest';
import { CategoryService } from 'src/app/services/category/category.service';
import { FileService } from 'src/app/services/file/file.service';
import { environment } from 'src/environments/environment';
import { ProductService } from './../../../../../services/product/product.service';
import { EPRODUCT_TYPE } from 'src/app/enum/EProduct';
import { BrandRequest } from 'src/app/models/brand/brand-request';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: 'product-list.component.scss',
  standalone: true,
  imports: [NgFor, FontAwesomeModule,
    ReactiveFormsModule,
    SpinnerModule,
    TooltipDirective,
    ElementRefDirective,
    ModalComponent, ModalHeaderComponent, ModalTitleDirective,
    ModalBodyComponent, ModalFooterComponent,
    ReactiveFormsModule,
    ToastModule],
  providers: [MessageService]
})
export class ProductListComponent implements OnInit {
  keyword: string = "";
  products: any = [];
  baseApi = environment.APIURL;
  categoryType?: any;
  @ViewChild('inputFiles') inputFile!: ElementRef;
  selectedFiles: File[] = new Array();
  faEdit = faPencil;
  faClose = faClose;
  faDelete = faTrashCan;
  productType = Object.values(EPRODUCT_TYPE);
  brandRequest: BrandRequest = {
    keyword: "",
    categoryId: undefined
  }
  visibleForm = {
    edit: false,
    delete: false,
    gallery: false
  };

  currentID?: string;
  galleryItemId?: string;
  currentImgs?: string[] = [];
  changedCategoryImgs?: string[] = [];
  brands: BrandModel[] = [];

  productEditForm = this.fb.group({
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

  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private fileService: FileService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    this.getAll();
    this.getCategory();
    this.getBrands(this.brandRequest);
  }

  getAll() {
    this.productService.getAll(this.keyword).subscribe({
      next: (res) => {
        this.products = res.data.data.map((item: any) => {
          item.image = `${this.baseApi}/${item.image}`
          return item;
        });
      }
    })
  }

  submitForm() {
    const formData: FormData = new FormData();
    Array.from(this.selectedFiles).forEach((file) => {
      formData.append('files', file, file.name);
    });

    let productRequest: IProduct = {
      name: {
        contentEng: this.productEditForm.get('nameContentEng')?.value!,
        contentVie: this.productEditForm.get('nameContentVie')?.value!,
      },
      categoryId: this.productEditForm.get('categoryId')?.value!,
      description: {
        contentEng: this.productEditForm.get('descriptionEng')?.value!,
        contentVie: this.productEditForm.get('descriptionVie')?.value!,
      },
      model: this.productEditForm.get('model')?.value!,
      contact: this.productEditForm.get('contact')?.value!,
      price: this.productEditForm.get('price')?.value!,
      amount: this.productEditForm.get('amount')?.value!,
      type: this.productEditForm.get('type')?.value!,
      id: this.currentID,
      gallery: this.changedCategoryImgs ? this.changedCategoryImgs : this.currentImgs!,
      status: 1,
      isHot: this.productEditForm.get('isHot')?.value!,
      discount: +this.productEditForm.get('discount')?.value!,
      brandId: +this.productEditForm.get('brandId')?.value!,
    }

    if (this.changedCategoryImgs) {
      this.fileService.uploadMultiple(formData!).subscribe({
        next: (res) => {
          this.changedCategoryImgs = res.data;
          productRequest.gallery = this.currentImgs?.concat(res.data);
          productRequest.gallery = this.removeImgLink(productRequest.gallery!);

          this.editProduct(productRequest);
        },
        error: (e: Error) => {
          this.messageService.add(
            { severity: 'error', summary: '', detail: 'Lưu Thất Bại' }
          );
        },
      })
    } else {
      this.editProduct(productRequest);
    }
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    for (let i = 0; i < event.target.files; i++) {
      this.selectedFiles.push(event.target.files[i]);
    };
  }

  handleDelete() {
    this.productService.delete(this.currentID!).subscribe({
      next: () => {
        this.messageService.add(
          { severity: 'success', summary: '', detail: 'Lưu Thành Công' },
        );
        this.visibleForm.delete = false;
        this.getAll();
      },
      error: () => {
        this.messageService.add(
          { severity: 'error', summary: '', detail: 'Lưu Thất Bại' }
        );
      },
    });
  }

  toggleEditModal(id?: string) {
    this.visibleForm.edit = !this.visibleForm.edit;

    this.currentID = id;
    if (this.currentID && this.visibleForm.edit) {
      this.productService.getById(this.currentID).subscribe({
        next: (res) => {
          console.log(res.data);
          
          this.productEditForm.patchValue({
            amount: parseInt(res.data?.amount),
            categoryId: res.data?.category.id,
            contact: res.data?.contact,
            descriptionEng: res.data?.description.contentEng,
            descriptionVie: res.data?.description.contentVie,
            model: res.data?.model,
            nameContentEng: res.data?.name.contentEng,
            nameContentVie: res.data?.name.contentVie,
            price: parseInt(res.data?.price),
            type: res.data?.type,
            brandId: res.data.brand.id,
            discount: res.data.discount,
            isHot: res.data.isHot
          });
          this.currentImgs = this.replaceImgLink(res.data?.gallery)
        }
      });
    };
  }

  toggleDelete(id?: string) {
    this.visibleForm.delete = !this.visibleForm.delete;
    this.currentID = id;
  }

  toggleDeleteGallery(id?: string) {
    this.visibleForm.gallery = !this.visibleForm.gallery;
    this.galleryItemId = id;
  }

  editProduct(payload: IProduct) {
    this.productService.edit(payload).subscribe({
      next: (res) => {
        this.messageService.add(
          { severity: 'success', summary: '', detail: 'Lưu Thành Công' },
        );
        this.inputFile.nativeElement.value = null;
        this.getAll();
      },
      error: () => {
        this.messageService.add(
          { severity: 'error', summary: '', detail: 'Lưu Thất Bại' }
        );
      },
      complete: () => {
        this.visibleForm.edit = false;
      }
    })
  }

  handleDeleteGallery() {
    this.currentImgs = this.currentImgs?.filter(item => item != this.galleryItemId);
    this.visibleForm.gallery = false;
  }

  private replaceImgLink(imgs: Array<string>): string[] | undefined {
    let imgArr: string[] | undefined = [];
    imgArr = imgs.map((item) => {
      return `${this.baseApi}/${item}`
    });
    return imgArr;
  }

  private getCategory() {
    this.categoryService.getAll(this.keyword).subscribe({
      next: (res) => {
        this.categoryType = res.data.data;
      },
      error: (e: Error) => {
        this.messageService.add(
          { severity: 'error', summary: '', detail: 'Lưu Thất Bại' }
        );
      }
    });
  }

  removeImgLink(arr: string[]): string[] | undefined {
    if (!arr) { return };
    const regex = new RegExp('(https://backend-construc\\.website/)', 'mgi')
    const subst = ``;
    let newArr = arr.map((item) => {
      item = item.replace(regex, subst);
      return item;
    });

    return newArr;
  }

  private getBrands(brandRequest: BrandRequest) {
    this.productService.getALlBrand(brandRequest).subscribe({
      next: (res) => {
        this.brands = res.data.data;
      }
    });
  }
}
