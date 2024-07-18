import { NgFor } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EPRODUCT_TYPE } from 'src/app/enum/EProduct';
import { CategoryClientRequest } from 'src/app/models/category/category-client-request';
import { CategoryClientService } from 'src/app/services/client-service/category/category.service';
import { environment } from 'src/environments/environment';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar-category',
  templateUrl: './sidebar-category.component.html',
  styleUrl: 'sidebar-category.component.scss',
  standalone: true,
  imports: [NgFor, CheckboxModule, FormsModule ]
})
export class SidebarCategoryComponent implements OnInit {
  @Output() categoryIds = new EventEmitter<Array<number>>();

  selectedCategories: any[] = [];

  categoryRequest: CategoryClientRequest = {
    categoryId: null,
    keyword: "",
    pageIndex: 1,
    pageSize: 15,
    type: EPRODUCT_TYPE.VEHICLE,
  };
  categorys: any = [];
  baseApi = environment.APIURL;
  constructor(
    private categoryClientService: CategoryClientService
  ) { }
  ngOnInit(): void {
    this.getAllCategory(this.categoryRequest);
  }

  getAllCategory(request: CategoryClientRequest) {
    this.categoryClientService.getAll(request).subscribe({
      next: (res) => {
        this.categorys = res.data.data.map((item: any) => {
          item.image = `${this.baseApi}/${item.image}`;
          return item;
        });
      },
      error: () => { }
    })
  };


  selectOnchange(event: any, categoryId: number) {
    if(event.checked && categoryId) {
      this.selectedCategories.push(categoryId);
    } else {
      const index = this.selectedCategories.indexOf(categoryId);
      if(index !== -1 ) {
        this.selectedCategories.splice(index, 1);
      };
    }
    this.categoryIds.emit(this.selectedCategories);
  }
}
