import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { EPRODUCT_TYPE } from 'src/app/enum/EProduct';
import { CategoryClientRequest } from 'src/app/models/category/category-client-request';
import { AddToCartService } from 'src/app/services/client-service/add-to-cart/add-to-card.service';
import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';
import { environment } from 'src/environments/environment';
import { SidebarCategoryComponent } from '../sidebar-category/sidebar-category.component';
import { ClientProductRequest } from './../../../../models/product/ClientProductRequest';
import { TranslateModule } from '@ngx-translate/core';
import { E_LANGUAGE } from 'src/app/enum/ELanguage';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: 'products.component.scss',
  standalone: true,
  imports: [UpperCasePipe, NgFor, FontAwesomeModule,
    ToastModule,
    SidebarCategoryComponent,
    ProgressSpinnerModule,
    NgIf,
    TranslateModule
  ],
  providers: [MessageService]
})
export class ProductsComponent implements OnInit {
  constructor(
    private productClientService: ProductClientService,
    private addToCartService: AddToCartService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.route.queryParams.subscribe(params => {
      let param = params['keyword'];
      if (param) {
        this.productRequest.keyword = param;
      }
    });
    this.getKeywordSearching();
  }
  keyword: string = "";
  products: any = [];
  categorys: any = [];
  baseApi = environment.APIURL;
  productType = EPRODUCT_TYPE.VEHICLE;

  productRequest: ClientProductRequest = {
    categoryIds: [],
    keyword: "",
    // pageIndex: 2,
    // pageSize: 99,
    type: EPRODUCT_TYPE.VEHICLE,
  };

  categoryRequest: CategoryClientRequest = {
    categoryId: null,
    keyword: "",
    pageIndex: 1,
    pageSize: 15,
    type: EPRODUCT_TYPE.VEHICLE,
  };

  faIcon = {
    faPhotoFilm: faPhotoFilm,
    faCartPlus: faCartPlus
  }

  defaultLang: string = "";

  ngOnInit(): void {
    this.getCurrentLanguage();
    this.getAllProduct(this.productRequest);
  }

  getCurrentLanguage() {
    this.defaultLang = localStorage.getItem('language') || E_LANGUAGE.VI;
  }

  emitCategoryIds(ids: any) {
    this.productRequest.categoryIds = [ids.categoryId];
    this.productRequest.brandId = ids.brandId;
    this.getAllProduct(this.productRequest);
  }

  getAllProduct(request: ClientProductRequest) {
    this.productClientService.getAll(request, this.defaultLang).subscribe({
      next: (res) => {
        this.products = res.data.data.map((item: any) => {
          item.image = `${this.baseApi}/${item.image}`;
          return item;
        });
      },
      error: () => { }
    })
  }

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

  getKeywordSearching() {
    this.productClientService.keywordService$.subscribe({
      next: (res) => {
        this.productRequest.keyword = res;
        this.getAllProduct(this.productRequest);
      }
    })
  }

  redirectToDetail(id: string) {
    this.router.navigate([`/dashboard/products/${id}`]);
  }
}
