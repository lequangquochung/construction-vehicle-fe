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
import { ActivatedRoute, Router } from '@angular/router';
import { TextColorDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToasterPlacement, ToastHeaderComponent } from '@coreui/angular';
import { ColorsToast } from 'src/app/enum/colors';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: 'products.component.scss',
  standalone: true,
  imports: [UpperCasePipe, NgFor, FontAwesomeModule,
    TextColorDirective,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent
  ]
})
export class ProductsComponent implements OnInit {
  constructor(
    private categoryClientService: CategoryClientService,
    private productClientService: ProductClientService,
    private addToCartService: AddToCartService,
    private router: Router,
    private route: ActivatedRoute

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

  ngOnInit(): void {
    this.getAllCategory();

    // console.log('categoryId', this.route.snapshot.params['categoryId']);
    this.route.queryParams.subscribe(param => {
      if (param) {
        this.productRequest.categoryId = param['categoryId'];
      }
      this.getAllProduct(this.productRequest);
    })

  }

  getAllProduct(request: ClientProductRequest) {
    this.productClientService.getAll(request).subscribe({
      next: (res) => {
        this.products = res.data.data.map((item: any) => {
          item.image = `${this.baseApi}/${item.image}`;
          return item;
        });
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
    this.isShowToast.success = true;
  }

  redirectToDetail(id: string) {
    this.router.navigate([`/dashboard/products/${id}`]);
  }

  redirectProductList(categoryId: string) {
    this.products = [];
    this.productRequest.categoryId = parseInt(categoryId);
    this.getAllProduct(this.productRequest);
  }
}
