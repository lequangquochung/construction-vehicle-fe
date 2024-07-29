import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpinnerModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { E_STATUS } from 'src/app/enum/ESTATUS';
import { OrderRequest } from 'src/app/models/order/orderRequest';
import { OrderService } from './../../../../../services/order/order.service';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrl: 'manage-order.component.scss',
  standalone: true,
  imports: [NgFor, FontAwesomeModule,
    CalendarModule,
    FormsModule,
    SpinnerModule,
    DropdownModule,
    InputTextModule,
    CommonModule,
    DialogModule,
    PaginatorModule,
    ButtonModule
  ]
})
export class ManageOrderComponent implements OnInit {
  visibleForm = {
    edit: false,
    delete: false
  };
  startDate?: string | undefined;
  endDate?: string | undefined;

  orders: any[] = [];

  faIcon = {
    faEdit: faPencil,
    faDelete: faTrashCan
  }
  totalItems: number = 0;
  first: number = 0;
  rows: number = 5;
  pageOptions = [5, 10, 20];

  statusList = Object.values(E_STATUS).map((item: any) => {
    return {
      label: this.titleCaseWord(item),
      value: item
    }
  });

  selectStatus = {
    label: "",
    value: "",
  }
  orderRequest: OrderRequest = {
    keyword: "",
    endDate: "",
    startDate: "",
    pageSize: this.rows,
    pageIndex: 1,
    status: ""
  };
  currentId: number;
  currentOrder: any = {};
  currentStatus: string = '';
  visible: boolean = false;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getAllOrder(this.orderRequest);
  }

  getAllOrder(rq: OrderRequest) {
    this.orderService.getAll(rq).subscribe({
      next: (res) => {
        this.orders = res.data.data;
        this.totalItems = res.totalItems;
      }
    })
  }

  getOrderById(id: number) {
    this.orderService.getOrderById(id).subscribe({
      next: (res) => {
        this.currentOrder = res.data;
        console.log(this.currentOrder);
        this.currentStatus = res.data.status;
      }
    })
  }

  search() {
    console.log('startDate', this.startDate);
    console.log('endDate', this.endDate);
    console.log('selectStatus', this.selectStatus);
    console.log('keyword', this.orderRequest.keyword);

    let rq: OrderRequest = {
      keyword: this.orderRequest.keyword,
      status: this.selectStatus.value,
      startDate: this.startDate,
      endDate: this.endDate
    }

    this.orderService.getAll(rq);
  }

  onPageChange(event: any) {
    this.orderRequest.pageIndex = event.page + 1;
    this.orderRequest.pageSize = event.rows;
    this.getAllOrder(this.orderRequest);
  }

  private titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  toggleEditModal(event: any, id?: number) {
    this.currentId = id!;
    this.getOrderById(this.currentId);
    this.visibleForm.edit = !this.visibleForm.edit;
    event.stopPropagation();
  }

  handleEdit() {

  }

  toggleDelete(event: any, id?: string) { }

}
