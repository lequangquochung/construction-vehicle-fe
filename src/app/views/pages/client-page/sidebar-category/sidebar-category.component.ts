import { NgFor, UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeModule } from 'primeng/tree';
import { E_LANGUAGE } from 'src/app/enum/ELanguage';
import { EPRODUCT_TYPE } from 'src/app/enum/EProduct';
import { CategoryClientRequest } from 'src/app/models/category/category-client-request';
import { ClientProductRequest } from 'src/app/models/product/ClientProductRequest';
import { ProductClientService } from 'src/app/services/client-service/product/product-client.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-sidebar-category',
  templateUrl: './sidebar-category.component.html',
  styleUrl: 'sidebar-category.component.scss',
  standalone: true,
  imports: [NgFor, CheckboxModule, FormsModule, TreeModule,
    TranslateModule,
    UpperCasePipe
  ]
})
export class SidebarCategoryComponent implements OnInit {
  @Output() categoryIds = new EventEmitter<any>();
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
    pageIndex: '',
    pageSize: '',
    keyword: "",
    categoryIds: [],
    type: '',
    isDiscount: '',
    isHot: '',
    brandId: ''
  }
  categorys: any[] = [];
  treeGroup: any[] = [];
  brandIds: any[] = [];
  productByBrand: any[] = [];
  treeNode: TreeNode[] = [];
  selected!: TreeNode;
  sideBarType = EPRODUCT_TYPE.VEHICLE
  baseApi = environment.APIURL;
  defaultLang: string = "";
  constructor(
    private productClientService: ProductClientService
  ) { }
  ngOnInit(): void {
    this.getCurrentLanguage();
    if (this.productType) {
      this.categoryRequest.type = this.productType;
      this.productRequest.type = this.productType;
    }
    this.getSideBar(this.sideBarType);
    this.productClientService.changeLanguage$.subscribe(item => {
      this.getCurrentLanguage();
      if (item) {
        if (this.treeNode) {
          this.treeNode = [];
          this.getSideBar(this.sideBarType);
        }
      };
    })
  }

  getCurrentLanguage() {
    this.defaultLang = localStorage.getItem('language') || E_LANGUAGE.VI;
  }

  getSideBar(type: string) {
    this.productClientService.getSideBar(type, this.defaultLang).subscribe({
      next: (res) => {
        this.treeNode = res.data.data.map((item: any) => {
          return {
            key: item.categoryId,
            label: item.categoryName,
            children: item?.brands?.map((brand: any) => {
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
    } else {
      const idValue = event?.node.key;

      if (idValue) {
        let categoryId: string = idValue.split(',')[0];
        let brandId: string = idValue.split(',')[1];
        this.categoryIds.emit({
          categoryId: categoryId,
          brandId: brandId
        });
      }
    }

  }
}
