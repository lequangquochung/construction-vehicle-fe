import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpinnerModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { E_STATUS } from 'src/app/enum/ESTATUS';
import { OrderRequest } from 'src/app/models/order/orderRequest';
import { OrderService } from './../../../../../services/order/order.service';
import { environment } from 'src/environments/environment';
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
    ButtonModule,
    ToastModule
  ],
  providers: [DatePipe, MessageService]
})
export class ManageOrderComponent implements OnInit {
  visibleForm = {
    edit: false,
    delete: false
  };
  startDate?: Date | undefined;
  endDate?: Date | undefined;

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
  })

  selectStatus = {
    label: 'New',
    value: E_STATUS.NEW,
  }
  orderRequest: OrderRequest = {
    keyword: "",
    endDate: "",
    startDate: "",
    pageSize: this.rows,
    pageIndex: 1,
    status: "",
    isDelete: false
  };
  currentId: number;
  currentOrder: any = {};
  currentStatus: string = E_STATUS.NEW;
  visible: boolean = false;
  baseApi: string = environment.APIURL;

  constructor(private orderService: OrderService,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {
    this.statusList.unshift({
      label: "All",
      value: ""
    });
  }

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
        console.log(res);

        this.currentOrder = res.data;
        this.currentStatus = res.data.status;
        this.currentOrder.orderDetails = this.currentOrder.orderDetails.map((item: any) => {
          item.product.image = `${this.baseApi}/${item.product.image}`
          return item;
        });
      }
    })
  }

  search() {
    let rq: OrderRequest = {
      keyword: this.orderRequest.keyword,
      status: this.selectStatus.value,
      startDate: this.startDate ? this.formatMyDate(this.startDate!) : '',
      endDate: this.endDate ? this.formatMyDate(this.endDate!) : '',
      isDelete: false,
      pageIndex: 1,
      pageSize: this.rows
    }

    this.getAllOrder(rq);
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

  toggleEditModal(id?: number) {
    this.currentId = id!;
    this.getOrderById(this.currentId);
    this.visibleForm.edit = !this.visibleForm.edit;
  }

  handleEdit() {
    this.orderService.changeStatus(this.currentStatus.toLowerCase(), this.currentId).subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add(
            { severity: 'success', summary: '', detail: 'Successfully' },
          );
          this.visibleForm.edit = false;
          this.getAllOrder(this.orderRequest);
        } else {
          this.messageService.add(
            { severity: 'error', summary: '', detail: 'Failed' },
          );
        }
      },
      error: () => {
        this.messageService.add(
          { severity: 'error', summary: '', detail: 'Failed' },
        );
      }
    });
  }

  toggleDelete(event: any, id?: string) { }

  private formatMyDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }

  checkStatusColor(status: string): string {
    let color: string = "";
    switch (status) {
      case E_STATUS.NEW:
        color = "white"
        break;
      case E_STATUS.PROCESSING:
        color = "green";
        break;
      case E_STATUS.CANCELED:
        color = "red";
        break;
      case E_STATUS.FINISHED:
        color = "darkgray";
        break
      default:
        break;
    }
    return color;
  }


}
