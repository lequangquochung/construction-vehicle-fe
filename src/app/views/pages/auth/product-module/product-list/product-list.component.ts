import { map } from 'rxjs';
import { ProductService } from './../../../../../services/product/product.service';
import { NgFor } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ElementRefDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, SpinnerModule, ToasterPlacement, TooltipDirective } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from 'src/environments/environment';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category/category.service';
import { ColorsToast } from 'src/app/enum/colors';
import { IProductRequest } from 'src/app/models/product/IProductRequest';

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
    ModalBodyComponent, ModalFooterComponent]
})
export class ProductListComponent implements OnInit {
  keyword: string = "";
  products: any = [];
  baseApi = environment.APIURL;
  categoryType?: any;
  @ViewChild('inputFile') inputFile!: ElementRef;
  faEdit = faPencil;
  faDelete = faTrashCan;

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

  visibleForm = {
    edit: false,
    delete: false
  };
  currentID?: string;
  currentImgs?: string[];

  productEditForm = this.fb.group({
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

  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
  ) { }
  ngOnInit(): void {
    this.getAll();
    this.getCategory();
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

  submitForm() { }


  handleDelete() {
    this.productService.delete(this.currentID!).subscribe({
      next: () => {
        this.isShowToast.success = true;
        this.visibleForm.delete = false;
        this.getAll();
      },
      error: () => {
        this.isShowToast.error = true;
      },
    });
  }

  toggleEditModal(id?: string) {
    this.visibleForm.edit = !this.visibleForm.edit;
    this.currentID = id;
    if (this.currentID && this.visibleForm.edit) {
      this.productService.getById(this.currentID).subscribe({
        next: (res) => {
          this.productEditForm.patchValue({
            amount: res.data?.amount,
            categoryId: res.data?.category.id,
            contact: res.data?.contact,
            descriptionEng: res.data?.description.contentEng,
            descriptionVie: res.data?.description.contentVie,
            model: res.data?.model,
            nameContentEng: res.data?.name.contentEng,
            nameContentVie: res.data?.name.contentVie,
            price: res.data?.price,
            type: res.data?.type,
          });
          this.currentImgs = this.replaceImgLink(res.data?.gallery)
        }
      })
    }
  }

  toggleDelete(id?: string) {
    this.visibleForm.delete = !this.visibleForm.delete;
    this.currentID = id;
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
        this.isShowToast.error = true;
      }
    });
  }


}
