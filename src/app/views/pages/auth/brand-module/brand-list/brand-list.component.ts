import { ProductService } from './../../../../../services/product/product.service';
import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ModalBodyComponent, ModalFooterComponent } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrl: 'brand-list.component.scss',
  standalone: true,
  imports: [NgFor, FontAwesomeModule,
    SpinnerModule,
    ModalComponent, ModalHeaderComponent, ModalTitleDirective,
    ModalBodyComponent, ModalFooterComponent,
    ReactiveFormsModule,]
})
export class BrandListComponent implements OnInit {
  faEdit = faPencil;
  faDelete = faTrashCan;
  brands: any = [];
  constructor(private productService: ProductService) {

  }
  ngOnInit(): void { 
    this.getAll();
  }

  getAll() {
    this.productService.getALlBrand().subscribe({
      next: (res) => {
        this.brands = res.data.data;
      }
    })
  }

  toggleEditModal(id?: string) {

  }

  toggleDelete(id?: string) { }
}
