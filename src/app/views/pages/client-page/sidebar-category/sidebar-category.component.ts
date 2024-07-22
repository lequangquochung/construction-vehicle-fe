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
    type: EPRODUCT_TYPE.VEHICLE,
  };

  productRequest: ClientProductRequest = {
    pageIndex: null,
    pageSize: null,
    keyword: "",
    categoryIds: [],
    type: EPRODUCT_TYPE.VEHICLE,
    isDiscount: false,
    isHot: false,
    brandId: undefined
  }
  categorys: any[] = [];
  treeGroup: any[] = [];
  brandIds: any[] = [];
  productByBrand: any[] = [];
  treeNode: TreeNode[] = [
    {
      "key": "0",
      "label": "Documents",
      "data": "Documents Folder",
      "icon": "pi pi-fw pi-inbox",
      "children": [
        {
          "key": "0-0",
          "label": "Work",
          "data": "Work Folder",
          "icon": "pi pi-fw pi-cog",
          "children": [
            {
              "key": "0-0-0",
              "label": "Expenses.doc",
              "icon": "pi pi-fw pi-file",
              "data": "Expenses Document"
            },
            {
              "key": "0-0-1",
              "label": "Resume.doc",
              "icon": "pi pi-fw pi-file",
              "data": "Resume Document"
            }
          ]
        },
        {
          "key": "0-1",
          "label": "Home",
          "data": "Home Folder",
          "icon": "pi pi-fw pi-home",
          "children": [
            {
              "key": "0-1-0",
              "label": "Invoices.txt",
              "icon": "pi pi-fw pi-file",
              "data": "Invoices for this month"
            }
          ]
        }
      ],
      "parent": undefined
    },
  ];
  baseApi = environment.APIURL;
  constructor(
    private categoryClientService: CategoryClientService,
    private productClientService: ProductClientService
  ) { }
  ngOnInit(): void {
    if (this.productType) {
      this.categoryRequest.type = this.productType;
    }
    this.getAllCategory(this.categoryRequest);
  }

  getAllCategory(request: CategoryClientRequest) {
    this.categoryClientService.getAll(request).subscribe({
      next: (res) => {
        this.categorys = res.data.data.map((item: any) => {
          return {
            categoryName: item.name,
            brands: item.brands
          }
        });
        this.categorys.forEach((element: any) => {
          element?.brands.forEach((brand: any) => {
            this.brandIds.push(brand);
          });
        });

        this.brandIds.forEach((item) => {
          this.productRequest.brandId = item.id;
          this.productClientService.getAll(this.productRequest).subscribe({
            next: (res) => {
              let arr: any[] = [];
              this.productByBrand = res.data.data;
              this.productByBrand.filter((product) => {
                if (product.brand.id == item.id) {
                  arr.push(product);
                } else {
                  return;
                }

              })
              item['product'] = arr;
              arr = [];
            }
          })
        });
        this.categorys.map((brands: any) => {
          brands.brands.forEach((brand: any) => {
            this.brandIds.forEach((item) => {
              if (item.id == brand.id) {
                brand['product'] = item.product;
              }
            })
          });
        })
        this.categorys.map((item, index) => {
          return {
            label: item.categoryName,
          }
        });
        // this.treeNode = this.categorys;

      },
      error: () => { }
    })
  };

  getProductByBrand(id: number): any {
    this.productRequest.brandId = id;

  }

  selectOnchange(event: any, categoryId: number) {
    if (event.checked && categoryId) {
      this.selectedCategories.push(categoryId);
    } else {
      const index = this.selectedCategories.indexOf(categoryId);
      if (index !== -1) {
        this.selectedCategories.splice(index, 1);
      };
    }
    this.categoryIds.emit(this.selectedCategories);
  }
}
