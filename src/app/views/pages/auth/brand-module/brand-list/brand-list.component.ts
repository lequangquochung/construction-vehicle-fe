import { ProductService } from './../../../../../services/product/product.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerModule, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ModalBodyComponent, ModalFooterComponent } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BrandModel } from 'src/app/models/product/IProductRequest';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrl: 'brand-list.component.scss',
  standalone: true,
  imports: [NgFor, NgIf, FontAwesomeModule,
    SpinnerModule,
    ModalComponent, ModalHeaderComponent, ModalTitleDirective,
    ModalBodyComponent, ModalFooterComponent,
    ReactiveFormsModule,
    ToastModule
  ],

  providers: [MessageService]
})
export class BrandListComponent implements OnInit {
  faEdit = faPencil;
  faDelete = faTrashCan;
  brands: any = [];
  visibleForm = {
    edit: false,
    delete: false
  };
  isLoading: boolean = false;
  brandFormEdit = this.fb.group({
    contentEng: ['', Validators.required],
    contentVie: ['', Validators.required],
    categoryId: [1, Validators.required]
  });
  keyword: string = '';
  categoryList: any = [];
  currentID?: number;
  constructor(private productService: ProductService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private messageService: MessageService
  ) {

  }
  ngOnInit(): void {
    this.getAll();
    this.getCategoryByBrand(this.keyword);
  }

  getAll() {
    this.productService.getALlBrand().subscribe({
      next: (res) => {
        this.brands = res.data.data;
      }
    })
  };

  getCategoryByBrand(keyword: string) {
    this.categoryService.getAll(keyword).subscribe({
      next: (res) => {
        this.categoryList = res.data.data;
      }
    })
  }

  toggleEditModal(id?: number) {
    this.visibleForm.edit = !this.visibleForm.edit;
    this.currentID = id;
    if (this.visibleForm.edit) {
      this.productService.getBrandById(id!).subscribe({
        next: (res) => {
          console.log(res.data.category);

          this.brandFormEdit.patchValue({
            categoryId: res.data.category.id,
            contentEng: res?.data.name?.contentEng,
            contentVie: res?.data.name?.contentVie
          })
        }
      })
    }
  }

  handleClickEdit() {
    let rq: BrandModel = {
      id: this.currentID,
      name: {
        contentEng: this.brandFormEdit.get('contentEng')?.value!,
        contentVie: this.brandFormEdit.get('contentVie')?.value!
      },
      categoryId: +this.brandFormEdit.controls['categoryId']?.value!
    }
    this.isLoading = true;
    this.productService.editBrand(rq).subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add(
            { severity: 'success', summary: '', detail: 'Edit Successfully' },
          );
          this.brandFormEdit.reset();
          this.visibleForm.edit = false;
          this.getAll();
        }
      },
      error: () => {
        this.messageService.add(
          { severity: 'error', summary: '', detail: 'Edit Failed' }
        )
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  toggleDelete(id?: number) {
    this.visibleForm.delete = !this.visibleForm.delete;
    this.currentID = id;
  }

  handleClickDelete() {
    this.productService.deleteBrand(this.currentID!).subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add(
            { severity: 'success', summary: '', detail: 'Delete Successfully' },
          );
          this.visibleForm.delete = false;
          this.getAll();
        }
      },
      error: () => {
        this.messageService.add(
          { severity: 'error', summary: '', detail: 'Delete Failed' }
        )
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }
}
