import { environment } from 'src/environments/environment';
import { ProductClientService } from './../../../../services/client-service/product/product-client.service';
import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import {UpperCasePipe} from '@angular/common';
import { ClientProductRequest } from 'src/app/models/product/ClientProductRequest';
import { EPRODUCT_TYPE } from 'src/app/enum/EProduct';
import { CategoryClientService } from 'src/app/services/client-service/category/category.service';
import { Router } from '@angular/router';
import { CategoryClientRequest } from 'src/app/models/category/category-client-request';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrl: 'preview.component.scss',
  standalone: true,
  imports: [NgFor, UpperCasePipe],
})
export class PreviewComponent implements OnInit {
  constructor(
    private categoryClientService: CategoryClientService,
    private router: Router
  ) { }
  keyword: string = "";
  categorys: any = [];
  baseApi = environment.APIURL;
  
  productRequest: ClientProductRequest = {
    categoryId: null,
    keyword: "",
    pageIndex: 1,
    pageSize: 15,
    type: EPRODUCT_TYPE.VEHICLE
  };

  categoryRequest: CategoryClientRequest= {
    categoryId: null,
    keyword: "",
    pageIndex: 1,
    pageSize: 15,
    type: EPRODUCT_TYPE.VEHICLE
  };
  ngOnInit(): void {
    this.getAllCategory();
   }

  getAllCategory() {
    this.categoryClientService.getAll(this.categoryRequest).subscribe({
      next: (res) => {
        this.categorys = res.data.data.map((item: any) => { 
          item.image = `${this.baseApi}/${item.image}`;
          return item;
        });
      },
      error: () => { }
    })
  }

  redirectToProductsl(categoryId: string){
    const param = {
      categoryId: categoryId,
    }
    this.router.navigate([`/dashboard/products/`],{queryParams: param});
  }
}
