import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryService } from './../../../../services/category/category.service';
import { Component, OnInit } from '@angular/core';
import { CategoryTableList } from 'src/app/models/category/category-request.model';
import { NgFor } from '@angular/common';
import { faParking, faPencil, faPencilSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { SpinnerModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: 'category-list.component.scss',
  standalone: true,
  imports: [NgFor, FontAwesomeModule,
    SpinnerModule]
})
export class CategoryListComponent implements OnInit {
  faEdit = faPencil;
  faDelete = faTrashCan;
  data: any;
  keyword: string = "";
  baseApi = environment.APIURL;
  constructor(
    private categoryService: CategoryService
  ) { }
  ngOnInit(): void {
    this.categoryService.getAll(this.keyword).subscribe({
      next: (res) => {
        this.data = res.data.data.map((item: CategoryTableList) => {
          item.image = `${this.baseApi}/${item.image}`;
          return item;
        });
        console.log(this.data);
      },
      error: () => { }
    })
  }


}
