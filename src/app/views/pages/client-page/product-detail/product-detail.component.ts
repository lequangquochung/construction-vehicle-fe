import { map } from 'rxjs';
import { ProductClientService } from './../../../../services/client-service/product/product-client.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleriaModule } from 'primeng/galleria';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: 'product-detail.component.scss',
  standalone: true,
  imports: [GalleriaModule]
})
export class ProductDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private productClientService: ProductClientService,
    private router: Router
  ) { }
  baseApi = environment.APIURL;
  id: string | null = null;
  language = {
    vi: "vi",
    eng: "eng",
  }
  product: any;
  images: any[] | undefined;

  responsiveOptions: any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id) {
      this.getProductDetail(this.id,this.language.vi);
    }
  }

  getProductDetail(id: string, lang: string) {
    this.productClientService.getById(id, lang).subscribe({
      next:(res) => {
        this.product = res.data;
        this.images = res.data.gallery.map((item:any)=> {
          item = `${this.baseApi}/${item}`;
          return item;
        });
        console.log(this.product);
      }
    })
  }

  redirectToProducts() {
    this.router.navigate([`/dashboard/products`]);
  }
}
