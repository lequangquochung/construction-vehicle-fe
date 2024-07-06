import { map } from 'rxjs';
import { ProductService } from './../../../../../services/product/product.service';
import { NgFor } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ElementRefDirective, SpinnerModule, TooltipDirective } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from 'src/environments/environment';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: 'product-list.component.scss',
  standalone: true,
  imports: [NgFor, FontAwesomeModule,
    SpinnerModule,
    TooltipDirective,
    ElementRefDirective]
})
export class ProductListComponent implements OnInit{
  keyword: string = "";
  products: any = [];
  baseApi = environment.APIURL;

  @ViewChild('inputFile') inputFile!: ElementRef;
  faEdit = faPencil;
  faDelete = faTrashCan;
  
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.productService.getAll(this.keyword).subscribe({
      next: (res) => {
        console.log(res);
        this.products = res.data.data.map((item: any) => {
          item.image = `${this.baseApi}/${item.image}`
          return item;
        });
      }
    })
  }

  toggleEditModal(id?: string) {}
  toggleDelete(id?: string){}
}
