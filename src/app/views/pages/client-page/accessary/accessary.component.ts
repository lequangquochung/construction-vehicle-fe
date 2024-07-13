import { UpperCasePipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TextColorDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToasterPlacement, ToastHeaderComponent } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPhotoFilm, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { ColorsToast } from 'src/app/enum/colors';
import { EPRODUCT_TYPE } from 'src/app/enum/EProduct';
import { ClientProductRequest } from 'src/app/models/product/ClientProductRequest';
import { AddToCartService } from 'src/app/services/client-service/add-to-cart/add-to-card.service';
import { CategoryClientService } from 'src/app/services/client-service/category/category.service';
import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-accessary',
  templateUrl: './accessary.component.html',
  styleUrl: 'accessary.component.scss',
  standalone: true,
  imports: [
    UpperCasePipe, NgFor, FontAwesomeModule,
    TextColorDirective,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent
  ]
})
export class AccessaryComponent implements OnInit {
  keyword: string = "";
  productRequest: ClientProductRequest = {
    categoryId: null,
    keyword: "",
    pageIndex: 1,
    pageSize: 15,
    type: EPRODUCT_TYPE.SPARE_PARTS
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

  autoHide = true;
  delay = 3000;
  fade = true;
  isShowToast = {
    success: false,
    error: false
  }
  constructor(
    private productClientService: ProductClientService,
    private categoryClientService: CategoryClientService,
    private addToCartService: AddToCartService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.getAllProduct(this.productRequest);
    this.getAllCategory();
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
    console.log(item);
    
    let cartData = this.addToCartService.getCartItem();
    cartData.map((cartItem: any) => {
      if(cartItem.id !== item.id) {
        cartData.push(item);
      } else {
        alert("Sản phẩm này đã có trong giỏ hàng của bạn");   
      }
    });
    console.log(cartData);
    
    // this.addToCartService.sendData(item);
    // this.isShowToast.success = true;
  }

  redirectToDetail(id: string){
    this.router.navigate([`/dashboard/products/${id}`]);
  }

  redirectProductList(categoryId: string) {
    this.products = [];
    this.productRequest.categoryId = parseInt(categoryId);
    this.getAllProduct(this.productRequest);
  }
}
