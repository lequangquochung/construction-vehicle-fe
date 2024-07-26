import { OrderService } from './../../../../../services/order/order.service';
import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SpinnerModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { OrderRequest } from 'src/app/models/order/orderRequest';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrl: 'manage-order.component.scss',
  standalone: true,
  imports: [NgFor, FontAwesomeModule,
    CalendarModule,
    FormsModule,
    SpinnerModule,]
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

  getDate(){
    console.log('startDate', this.startDate);
    console.log('endDate', this.endDate);
  }

  toggleEditModal(id?: string) { }
  toggleDelete(id?: string) { }

}
