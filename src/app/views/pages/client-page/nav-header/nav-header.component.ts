import { E_LANGUAGE } from './../../../../enum/ELanguage';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';
import { AddToCartService } from './../../../../services/client-service/add-to-cart/add-to-card.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrl: 'nav-header.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [RouterModule, FontAwesomeModule,
    FormsModule,
    NgFor,
    NgIf,
    TranslateModule,
    UpperCasePipe,
    DialogModule
  ]
})
export class NavHeaderComponent implements OnInit {
  @ViewChild('dropdownLanguage') dropdownLanguage: ElementRef;
  @Output() keywordProduct = new EventEmitter<string>;
  private translate = inject(TranslateService);
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

  isEnglish: boolean = false;

  COUNTRY_ENUM = {
    VI: "vi",
    EN: "en"
  }

  cartCount: number = 0;
  itemInCart: any[] = [];
  STORAGE_KEY = "cartItem";

  visibleLanguageModal: boolean = false;
  constructor(
    private addToCartService: AddToCartService,
    private router: Router,
    private productClientService: ProductClientService,
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

    const defaultLang = localStorage.getItem('language') || E_LANGUAGE.VI;
    defaultLang === E_LANGUAGE.EN ? this.isEnglish = true : this.isEnglish = false;
    this.translate.setDefaultLang(defaultLang);
    this.translate.use(defaultLang);
  }

  showLanguageModal() {
    this.visibleLanguageModal = true;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    this.visibleLanguageModal = false;
    this.productClientService.changeLang(true);
    this.setCountryFlag(lang);
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

  setCountryFlag(country: string) {
    if (country === "en") {
      this.isEnglish = true;
    } else {
      this.isEnglish = false;
    }    
  }
}

export class Slides {
  title: string | undefined;
  src: string | undefined;
}