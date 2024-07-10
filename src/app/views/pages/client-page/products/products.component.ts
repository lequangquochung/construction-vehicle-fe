import { ClientProductRequest } from './../../../../models/product/ClientProductRequest';
import { NgFor, UpperCasePipe } from '@angular/common';
import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';
import { CategoryClientService } from './../../../../services/client-service/category/category.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EPRODUCT_TYPE } from 'src/app/enum/EProduct';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus, faEdit, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { AddToCartService } from 'src/app/services/client-service/add-to-cart/add-to-card.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: 'products.component.scss',
  standalone: true,
  imports: [UpperCasePipe, NgFor, FontAwesomeModule]
})
export class ProductsComponent implements OnInit {
  constructor(
    private categoryClientService: CategoryClientService,
    private productClientService: ProductClientService,
    private addToCartService: AddToCartService
  ) { }
  keyword: string = "";
  products: any = [];
  categorys: any = [];
  baseApi = environment.APIURL;
  productRequest: ClientProductRequest = {
    categoryId: null,
    keyword: "",
    pageIndex: 1,
    pageSize: 15,
    type: EPRODUCT_TYPE.VEHICLE
  };

  faIcon = {
    faPhotoFilm: faPhotoFilm,
    faCartPlus: faCartPlus

  }

  ngOnInit(): void {
    this.getAllProduct();
    this.getAllCategory();
  }

  getAllProduct() {
    this.productClientService.getAll(this.productRequest).subscribe({
      next: (res) => {
        this.products = res.data.data.map((item: any) => {
          item.image = `${this.baseApi}/${item.image}`;
          return item;
        });
        console.log('products', this.products);

      },
      error: () => { }
    })
  }

  getAllCategory() {
    this.categoryClientService.getAll(this.keyword).subscribe({
      next: (res) => {
        this.categorys = res.data.data.map((item: any) => {
          item.image = `${this.baseApi}/${item.image}`;
          return item;
        });
      },
      error: () => { }
    })
  };

  addToCart(item: any) {
    this.addToCartService.sendData(item);
  }
}
