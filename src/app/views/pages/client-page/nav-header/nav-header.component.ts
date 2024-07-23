import { NgFor } from '@angular/common';
import { AddToCartService } from './../../../../services/client-service/add-to-cart/add-to-card.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarouselComponent, CarouselControlComponent, CarouselInnerComponent, CarouselItemComponent } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

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
  pageLink = {
    aboutUs: "about-us"
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
    private router: Router
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
    this.router.navigate(['/dashboard/products'], {
      queryParams: { key1: 'value1', key2: 'value2' }
    });
  }
}

export class Slides {
  title: string | undefined;
  src: string | undefined;
}