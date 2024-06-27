import { CategoryService } from './../../../../services/category/category.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: 'category-list.component.scss',
  standalone: true
})
export class CategoryListComponent implements OnInit {
  data: any;
  keyword:string = ""
  constructor(
    private categoryService: CategoryService
  ) { }
  ngOnInit(): void {
    this.categoryService.getAll(this.keyword).subscribe({
      next: (res) => {
        console.log('res', res);
      },
      error: () => { }
    })
  }


}
