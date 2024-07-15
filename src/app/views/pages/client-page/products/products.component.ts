import { NgFor, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterPlacement } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ColorsToast } from 'src/app/enum/colors';
import { EPRODUCT_TYPE } from 'src/app/enum/EProduct';
import { CategoryClientRequest } from 'src/app/models/category/category-client-request';
import { AddToCartService } from 'src/app/services/client-service/add-to-cart/add-to-card.service';
import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';
import { environment } from 'src/environments/environment';
import { ClientProductRequest } from './../../../../models/product/ClientProductRequest';
import { CategoryClientService } from './../../../../services/client-service/category/category.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: 'products.component.scss',
  standalone: true,
  imports: [UpperCasePipe, NgFor, FontAwesomeModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class ProductsComponent implements OnInit {
  constructor(
    private categoryClientService: CategoryClientService,
    private productClientService: ProductClientService,
    private addToCartService: AddToCartService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService

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

  categoryRequest: CategoryClientRequest = {
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
    this.getAllCategory(this.categoryRequest);

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

  getAllCategory(request: CategoryClientRequest) {
    this.categoryClientService.getAll(this.categoryRequest).subscribe({
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
    let cartData = this.addToCartService.getCartItem();
    if (cartData.some(cartItem => cartItem.id === item.id)) {
      this.messageService.add(
        { severity: 'warn', summary: '', detail: 'Sản phẩm này đã có trong giỏ hàng của bạn' }
      )
    } else {
      this.addToCartService.sendData(item);
      this.messageService.add(
        { severity: 'success', summary: '', detail: 'Đã thêm vào giỏ hàng' }
      )
    };
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
