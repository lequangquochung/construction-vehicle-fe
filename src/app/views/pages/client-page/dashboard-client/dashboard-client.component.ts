import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { Component, Injectable, OnInit } from '@angular/core';
import {NavHeaderComponent} from '../nav-header/nav-header.component';

@Injectable()

@Component({
  selector: 'app-dashboard-client',
  templateUrl: './dashboard-client.component.html',
  styleUrl: 'dashboard-client.component.scss',
  standalone: true,
  imports: [NavHeaderComponent]
})

export class DashboardClientComponent implements OnInit {
  ngOnInit(): void {
    
  }
}
