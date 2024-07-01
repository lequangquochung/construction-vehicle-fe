import { Component, ElementRef, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextColorDirective, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { CategoryRequestModel } from 'src/app/models/category/category-request.model';
import { ColorsToast } from '../../../../../enum/colors';
import { CategoryService } from '../../../../../services/category/category.service';
import { FileService } from '../../../../../services/file/file.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: 'category.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule,
    TextColorDirective,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CategoryComponent implements OnInit {
  @ViewChild('inputFile') inputFile!: ElementRef;

  categoryImg?: any;
  categoryForm = this.fb.group({
    nameEng: new FormControl<string>('', [Validators.required]),
    nameVie: new FormControl<string>('', [Validators.required]),
  });

  positions = Object.values(ToasterPlacement);
  position = ToasterPlacement.TopEnd;
  positionStatic = ToasterPlacement.BottomEnd;
  toastColors = ColorsToast.success;
  autoHide = true;
  delay = 3000;
  fade = true;
  isShowToast = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private fileService: FileService
  ) { }
  ngOnInit(): void {

  }

  onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.categoryImg = file;
    }
  }

  submitForm() {
    let categoryName: CategoryRequestModel = {
      name: {
        contentEng: this.categoryForm.get("nameEng")?.value!,
        contentVie: this.categoryForm.get("nameVie")?.value!,
      },
      image: ""
    }

    const formData: FormData = new FormData();
    formData.append('file', this.categoryImg!);

    this.fileService.uploadSingle(formData).subscribe({
      next: (res) => {
        categoryName.image = res.data;
        this.createCategory(categoryName);
      }, error: (e: Error) => {
        this.isShowToast = true;
        this.toastColors = ColorsToast.danger;
      }
    });
  }

  createCategory(categoryName: CategoryRequestModel) {
    
    this.categoryService.create(categoryName).subscribe({
      next: (res: any) => {
        this.isShowToast = true;
      },
      error: (e: Error) => {},
      complete: () => {
        this.categoryForm.patchValue({
          nameEng: '',
          nameVie: ''
        });
        this.inputFile.nativeElement.value = null;
      },
    });
  }
}
