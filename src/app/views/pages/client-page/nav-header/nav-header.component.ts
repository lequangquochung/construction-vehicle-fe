import { NgFor } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';
import { AddToCartService } from './../../../../services/client-service/add-to-cart/add-to-card.service';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrl: 'nav-header.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [RouterModule, FontAwesomeModule,
    FormsModule,
    NgFor
  ]
})
export class NavHeaderComponent implements OnInit {
  @Output() keywordProduct = new EventEmitter<string>;
  pageLink = {
    aboutUs: "about-us",
    product: "/dashboard/products"
  };
  email = 'cogioiducanh77@gmail.com'
  keyword?: string = "";

  faIcon = {
    faCartPlus: faCartPlus,
    faSearch: faSearch
  }
  

  cartCount: number = 0;
  itemInCart: any[] = [];
  STORAGE_KEY = "cartItem";
  constructor(
    private addToCartService: AddToCartService,
    private router: Router,
    private productClientService: ProductClientService
  ) {
    this.getCountItem();
  }

  ngOnInit(): void {
    this.addToCartService.data$.subscribe(data => {
      this.itemInCart.push(data);
      this.saveStorage(this.itemInCart);
      this.getCountItem();
    });
    this.addToCartService.isChangedData$.subscribe(data => {
      if (data) {
        this.getCountItem();
      };
    })
  }

  saveStorage(value: any) {
    this.addToCartService.addItem(value);
    this.getCountItem();
  }

  getCountItem() {
    const value = localStorage.getItem(this.STORAGE_KEY);
    let data: Array<string> = value ? JSON.parse(value) : null;
    this.cartCount = data?.length ? data?.length : 0;
  }

  searchProduct() {
    if (this.router.url.includes(this.pageLink.product)) {
      this.productClientService.sendKeyword(this.keyword!);
    } else {
      this.router.navigate(['/dashboard/products'], {
        queryParams: { keyword: this.keyword }
      });
    }

  }
}

export class Slides {
  title: string | undefined;
  src: string | undefined;
}