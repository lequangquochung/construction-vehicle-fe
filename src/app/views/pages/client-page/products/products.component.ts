import { NgFor, UpperCasePipe } from '@angular/common';
import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';
import { CategoryClientService } from './../../../../services/client-service/category/category.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: 'products.component.scss',
  standalone: true,
  imports: [UpperCasePipe, NgFor]
})
export class ProductsComponent implements OnInit {
  constructor(
    private categoryClientService: CategoryClientService,
    private productClientService: ProductClientService
  ) { }
  keyword: string = "";
  categorys: any = [];
  baseApi = environment.APIURL;
  ngOnInit(): void {
    this.getAllCategory();
  }

  getAllCategory() {
    this.productClientService.getAll(this.keyword).subscribe({
      next: (res) => {
        this.categorys = res.data.data.map((item: any) => {
          item.image = `${this.baseApi}/${item.image}`;
          return item;
        });
        console.log('categorys', this.categorys);

      },
      error: () => { }
    })
  }
}
