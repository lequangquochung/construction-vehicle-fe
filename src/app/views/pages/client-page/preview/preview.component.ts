import { NgFor, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarouselComponent, CarouselControlComponent, CarouselIndicatorsComponent, CarouselInnerComponent, CarouselItemComponent } from '@coreui/angular';
import { CardModule } from 'primeng/card';
import { EPRODUCT_TYPE } from 'src/app/enum/EProduct';
import { ClientProductRequest } from 'src/app/models/product/ClientProductRequest';
import { environment } from 'src/environments/environment';
import { Slides } from '../nav-header/nav-header.component';
import { ProductClientService } from './../../../../services/client-service/product/product-client.service';
import { TranslateModule } from '@ngx-translate/core';
import { E_LANGUAGE } from 'src/app/enum/ELanguage';
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
    CardModule,
    TranslateModule,
    UpperCasePipe,
  ],
})
export class PreviewComponent implements OnInit {
  constructor(
    private productClientService: ProductClientService,
    private router: Router
  ) { }
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

  products: any[] = [];
  productRequest: ClientProductRequest = {
    categoryIds: '',
    keyword: "",
    pageIndex: 1,
    pageSize: 15,
    type: EPRODUCT_TYPE.VEHICLE,
    brandId: undefined,
    isHot: true,
  };
  defaultLang: string = "";

  ngOnInit(): void {
    this.getCurrentLanguage();
    this.getHotProduct(this.productRequest);
  }
  
  getCurrentLanguage() {
    this.defaultLang = localStorage.getItem('language') || E_LANGUAGE.VI;
  }

  getHotProduct(rq: ClientProductRequest) {
    this.productClientService.getAll(rq, this.defaultLang).subscribe({
      next: (res) => {
        this.products = res.data.data.map((item: any) => {
          item.image = `${this.baseApi}/${item.image}`;
          return item;
        }).slice(0, 8);
      }
    })
  }
  redirectToProducts() {
    this.router.navigate(['/dashboard/products']);
  }
}
