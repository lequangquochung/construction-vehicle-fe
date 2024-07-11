import { ProductClientService } from './../../../../services/client-service/product/product-client.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: 'product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private productClientService: ProductClientService
  ) { }
  id: string | null = null;
  language = {
    vi: "vi",
    eng: "eng",
  }
  product: any;
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id) {
      this.getProductDetail(this.id,this.language.vi);
    }
    console.log(this.id);
  }

  getProductDetail(id: string, lang: string) {
    this.productClientService.getById(id, lang).subscribe({
      next:(res) => {
        console.log(res);
        
      }
    })
  }
}
