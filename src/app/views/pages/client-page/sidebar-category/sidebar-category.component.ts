import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';
import { map } from 'rxjs';
import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EPRODUCT_TYPE } from 'src/app/enum/EProduct';
import { CategoryClientRequest } from 'src/app/models/category/category-client-request';
import { CategoryClientService } from 'src/app/services/client-service/category/category.service';
import { environment } from 'src/environments/environment';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ClientProductRequest } from 'src/app/models/product/ClientProductRequest';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
@Component({
  selector: 'app-sidebar-category',
  templateUrl: './sidebar-category.component.html',
  styleUrl: 'sidebar-category.component.scss',
  standalone: true,
  imports: [NgFor, CheckboxModule, FormsModule, TreeModule]
})
export class SidebarCategoryComponent implements OnInit {
  @Output() categoryIds = new EventEmitter<Array<number>>();
  @Input() productType!: string;

  selectedCategories: any[] = [];

  categoryRequest: CategoryClientRequest = {
    categoryId: null,
    keyword: "",
    pageIndex: 1,
    pageSize: 15,
    type: undefined,
  };

  productRequest: ClientProductRequest = {
    pageIndex: null,
    pageSize: null,
    keyword: "",
    categoryIds: [],
    type: undefined,
    isDiscount: false,
    isHot: false,
    brandId: undefined
  }
  categorys: any[] = [];
  treeGroup: any[] = [];
  brandIds: any[] = [];
  productByBrand: any[] = [];
  treeNode: TreeNode[] = [];
  selected!: TreeNode;
  sideBarType = EPRODUCT_TYPE.VEHICLE
  baseApi = environment.APIURL;
  constructor(
    private categoryClientService: CategoryClientService,
    private productClientService: ProductClientService
  ) { }
  ngOnInit(): void {
    if (this.productType) {
      this.categoryRequest.type = this.productType;
      this.productRequest.type = this.productType;
    }
    this.getSideBar(this.sideBarType)
  }

  getSideBar(type: string) {
    this.productClientService.getSideBar(type).subscribe({
      next: (res) => {
        this.treeNode = res.data.data.map((item: any) => {
          return {
            key: item.categoryId,
            label: item.categoryName,
            children: item.brands.map((brand: any) => {
              return {
                key: `${item.categoryId},${brand.id}`,
                label: brand.name
              }
            })
          }
        });
      }
    })
  }

  clickSearchProduct(event: any) {
    let isChildren: boolean = event.node?.parent;
    if (!isChildren) {
      event?.originalEvent.target?.children[0]?.click()
    }
    const idValue = event?.node.key;
    if (idValue) {
      this.categoryIds.emit(idValue);
    }
  }
}
