import { environment } from 'src/environments/environment';
import { ProductClientService } from './../../../../services/client-service/product/product-client.service';
import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrl: 'preview.component.scss',
  standalone: true,
  imports: [NgFor, UpperCasePipe],
})
export class PreviewComponent implements OnInit {
  constructor(
    private productClientService: ProductClientService
  ) { }
  keyword: string = "";
  categorys: any = [];
  baseApi = environment.APIURL;
  ngOnInit(): void {
    this.getAllCategory();
   }

  getAllCategory() {
    this.productClientService.getAll(this.keyword).subscribe({
      next: (res) => {
        this.categorys = res.data.data.map((item: any) => {
          item.image = `${this.baseApi}/${item.image}`;
          return item;
        });
        console.log('categorys', this.categorys);
        
      },
      error: () => { }
    })
  }
}
