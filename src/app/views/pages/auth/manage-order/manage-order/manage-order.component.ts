import { NgFor } from '@angular/common';
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
    InputTextModule]
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

  };
  constructor(private orderService: OrderService) {

  }
  ngOnInit(): void {
    this.getAllOrder(this.orderRequest);
  }

  getAllOrder(rq: OrderRequest) {
    this.orderService.getAll(rq).subscribe({
      next: (res) => {
        console.log(res);
        
        this.orders = res.data.data;
      }
    })
  }

  search() {
    console.log('startDate', this.startDate);
    console.log('endDate', this.endDate);
    console.log('selectStatus', this.selectStatus);
    console.log('keyword', this.orderRequest.keyword);
    
    
    this.orderRequest = {
      keyword: this.orderRequest.keyword,
      status: this.selectStatus.value,
      startDate: this.startDate,
      endDate: this.endDate
    }
  }

  private titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  toggleEditModal(id?: string) { }
  toggleDelete(id?: string) { }

}
