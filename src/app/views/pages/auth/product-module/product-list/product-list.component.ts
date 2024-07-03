import { ProductService } from './../../../../../services/product/product.service';
import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SpinnerModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: 'product-list.component.scss',
  standalone: true,
  imports: [NgFor, FontAwesomeModule,
    SpinnerModule,]
})
export class ProductListComponent implements OnInit{
  keyword: string = "";
  products: any = [];
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    
  }

  getAll() {
    this.productService.getAll(this.keyword).subscribe({
      next: (res) => {
        this.products = res.data.data;
      }
    })
  }
}
