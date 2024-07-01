import { NgFor } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, SpinnerModule, TextColorDirective, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ColorsToast } from 'src/app/enum/colors';
import { CategoryRequestModel, CategoryTableList } from 'src/app/models/category/category-request.model';
import { FileService } from 'src/app/services/file/file.service';
import { environment } from 'src/environments/environment';
import { CategoryService } from '../../../../../services/category/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: 'category-list.component.scss',
  standalone: true,
  imports: [NgFor, FontAwesomeModule,
    SpinnerModule,
    ModalComponent, ModalHeaderComponent, ModalTitleDirective,
    ModalBodyComponent, ModalFooterComponent,
    ReactiveFormsModule,
    TextColorDirective,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent]
})
export class CategoryListComponent implements OnInit {
  @ViewChild('inputFile') inputFile!: ElementRef;
  faEdit = faPencil;
  faDelete = faTrashCan;
  data: any;
  keyword: string = "";
  baseApi = environment.APIURL;
  visibleForm = {
    edit: false,
    delete: false
  };
  positions = Object.values(ToasterPlacement);
  position = ToasterPlacement.TopEnd;
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
  currentID?: string;

  currentCategoryImg?: any;
  changedCategoryImg?: any;
  categoryEditForm = this.fb.group({
    nameEng: new FormControl<string>('', [Validators.required]),
    nameVie: new FormControl<string>('', [Validators.required]),
  });
  constructor(
    private categoryService: CategoryService,
    private fileService: FileService,
    private fb: FormBuilder
  ) { }
  ngOnInit(): void {
    this.getAllCategory();
  }

  toggleEditModal(id?: string) {
    this.currentID = id;
    this.visibleForm.edit = !this.visibleForm.edit;
    if (this.visibleForm.edit) {
      this.categoryService.getById(id!).subscribe({
        next: (res) => {
          this.categoryEditForm.patchValue({
            nameEng: res?.data.name?.contentEng,
            nameVie: res?.data.name?.contentVie
          });
          this.currentCategoryImg = res.data.image;
        }
      });
    }
  }

  toggleDelete(id?: string) {
    this.visibleForm.delete = !this.visibleForm.delete;
    this.currentID = id;
  }

  onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.changedCategoryImg = file;
    }
  }

  submitForm() {
    let categoryRequest: CategoryRequestModel = {
      id: this.currentID,
      name: {
        contentEng: this.categoryEditForm.get("nameEng")?.value!,
        contentVie: this.categoryEditForm.get("nameVie")?.value!,
      },
      image: this.changedCategoryImg ? this.changedCategoryImg : this.currentCategoryImg
    };

    const formData: FormData = new FormData();
    formData.append('file', this.changedCategoryImg!);

    if (this.changedCategoryImg) {
      this.fileService.uploadSingle(formData).subscribe({
        next: (res) => {
          categoryRequest.image = res.data;
          this.editCategory(categoryRequest);
        }, error: (e: Error) => {
          this.isShowToast.error = true;
        }
      });
    };
  }

  editCategory(payload: CategoryRequestModel) {
    console.log(payload);
    this.categoryService.edit(payload).subscribe({
      next: (res) => {
        this.isShowToast.success = true;
        this.getAllCategory();
      },
      error: () => {
        this.isShowToast.error = true;
      },
      complete: () => {
        this.visibleForm.edit = false;
      }
    })
  }

  handleDelete() {
    this.categoryService.delete(this.currentID!).subscribe({
      next: () => {
        this.isShowToast.success = true;
        this.visibleForm.delete = false;
        this.getAllCategory();
      },
      error: () => {
        this.isShowToast.error = true;
      }
    });
  }

  getAllCategory() {
    this.categoryService.getAll(this.keyword).subscribe({
      next: (res) => {
        this.data = res.data.data.map((item: CategoryTableList) => {
          item.image = `${this.baseApi}/${item.image}`;
          return item;
        });
      },
      error: () => { }
    })
  }
}
