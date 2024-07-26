import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductClientService } from './../../../../services/client-service/product/product-client.service';
import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { UpperCasePipe } from '@angular/common';
import { ClientProductRequest } from 'src/app/models/product/ClientProductRequest';
import { EPRODUCT_TYPE } from 'src/app/enum/EProduct';
import { CategoryClientService } from 'src/app/services/client-service/category/category.service';
import { Router, RouterModule } from '@angular/router';
import { CategoryClientRequest } from 'src/app/models/category/category-client-request';
import { Slides } from '../nav-header/nav-header.component';
import { CarouselComponent, CarouselControlComponent, CarouselIndicatorsComponent, CarouselInnerComponent, CarouselItemComponent } from '@coreui/angular';
import { CardModule } from 'primeng/card';
import { BrandModel } from 'src/app/models/product/IProductRequest';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrl: 'preview.component.scss',
  standalone: true,
  imports: [NgFor, UpperCasePipe, CarouselComponent,
    CarouselControlComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
    CarouselIndicatorsComponent,
    RouterModule,
    CardModule],
})
export class PreviewComponent implements OnInit {
  constructor(
    private categoryClientService: CategoryClientService,
    private productClientService: ProductClientService,
    private router: Router
  ) { }
  keyword: string = "";
  categorys: any = [];
  baseApi = environment.APIURL;

  slides: Slides[] = [
    {
      title: "",
      src: "/assets/images/slides/1.jpg"
    },
    {
      title: "",
      src: "/assets/images/slides/2.jpg"
    },
  ];
  brands: BrandModel[] = [];
  productsByBrands: any[] = [];
  products: any[] = [];
  productRequest: ClientProductRequest = {
    categoryIds: [],
    keyword: "",
    pageIndex: 1,
    pageSize: 15,
    type: EPRODUCT_TYPE.VEHICLE,
    brandId: undefined,
    isHot: true,
  };

  categoryRequest: CategoryClientRequest = {
    categoryId: null,
    keyword: "",
    pageIndex: 1,
    pageSize: 15,
    type: EPRODUCT_TYPE.VEHICLE
  };
  ngOnInit(): void {
    this.getAllCategory();
    this.getBrands('vi');
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

  getBrands(language: string) {
    this.productClientService.getAllBrands(language).subscribe({
      next: (res) => {
        this.brands = res.data?.data!;
        this.brands.forEach((brand) => {
          this.getProductByBrands(brand.id!)
        })
      }
    })
  }

  getProductByBrands(brandId: number) {
    this.productRequest.brandId = brandId;
    this.productClientService.getAll(this.productRequest).subscribe({
      next: (res) => {
        res.data?.data.map((item: any) => {
          let obj = {
            name: item.name,
            products: [item]
          }
          this.productsByBrands.push(obj);
          this.productsByBrands.forEach((item: any) => {
            item.products.map((product: any) => {
              product.image = `${this.baseApi}/${product.image}`
              return product;
            });
          })
        });
      }
    })
  }
}
