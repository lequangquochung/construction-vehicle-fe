import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterPlacement } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ColorsToast } from 'src/app/enum/colors';
import { EPRODUCT_TYPE } from 'src/app/enum/EProduct';
import { ClientProductRequest } from 'src/app/models/product/ClientProductRequest';
import { AddToCartService } from 'src/app/services/client-service/add-to-cart/add-to-card.service';
import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';
import { environment } from 'src/environments/environment';
import { SidebarCategoryComponent } from '../sidebar-category/sidebar-category.component';
import { TranslateModule } from '@ngx-translate/core';
import { E_LANGUAGE } from 'src/app/enum/ELanguage';

@Component({
  selector: 'app-accessary',
  templateUrl: './accessary.component.html',
  styleUrl: 'accessary.component.scss',
  standalone: true,
  imports: [
    UpperCasePipe, NgFor, FontAwesomeModule,
    ToastModule,
    SidebarCategoryComponent,
    NgIf,
    TranslateModule
  ],
  providers: [MessageService]
})
export class AccessaryComponent implements OnInit {
  keyword: string = "";
  productRequest: ClientProductRequest = {
    categoryIds: [],
    keyword: "",
    pageIndex: 1,
    pageSize: 15,
    type: EPRODUCT_TYPE.SPARE_PARTS
  };

  categoryRequest: ClientProductRequest = {
    categoryIds: [],
    keyword: "",
    pageIndex: 1,
    pageSize: 15,
    type: EPRODUCT_TYPE.SPARE_PARTS,
    isDiscount: false
  };
  products: any = [];
  categorys: any = [];
  baseApi = environment.APIURL;
  faIcon = {
    faPhotoFilm: faPhotoFilm,
    faCartPlus: faCartPlus
  }

  positionStatic = ToasterPlacement.BottomEnd;
  toastColors = {
    success: ColorsToast.success,
    error: ColorsToast.danger
  };
  defaultLang: string = "";
  productType = EPRODUCT_TYPE.SPARE_PARTS
  
  constructor(
    private productClientService: ProductClientService,
    private addToCartService: AddToCartService,
    private router: Router,
    private messageService: MessageService
  ) {

  }
  ngOnInit(): void {
    this.getCurrentLanguage();
    this.getAllProduct(this.productRequest);
  }

  getCurrentLanguage() {
    this.defaultLang = localStorage.getItem('language') || E_LANGUAGE.VI;
  }

  getAllProduct(request: ClientProductRequest) {
    this.productClientService.getAll(request,this.defaultLang).subscribe({
      next: (res) => {
        this.products = res.data.data.map((item: any) => {
          item.image = `${this.baseApi}/${item.image}`;
          return item;
        });
      },
      error: () => { }
    })
  }

  emitCategoryIds(categoryIds: Array<number>) {
    this.productRequest.categoryIds = categoryIds;
    this.getAllProduct(this.productRequest);
  }

  addToCart(item: any) {
    let cartData = this.addToCartService.getCartItem();
    if (cartData.some(cartItem => cartItem.id === item.id && cartItem.type === item.type)) {
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

  redirectToDetail(id: string){
    this.router.navigate([`/dashboard/products/${id}`]);
  }
}
