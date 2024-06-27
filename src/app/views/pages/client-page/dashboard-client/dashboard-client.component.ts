import { Component, Injectable, OnInit } from '@angular/core';
import {NavHeaderComponent} from '../nav-header/nav-header.component';
import { NavFooterComponent } from '../nav-footer/nav-footer.component';
import { RouterModule } from '@angular/router';

@Injectable()

@Component({
  selector: 'app-dashboard-client',
  templateUrl: './dashboard-client.component.html',
  styleUrl: 'dashboard-client.component.scss',
  standalone: true,
  imports: [RouterModule ,NavHeaderComponent, NavFooterComponent]
})

export class DashboardClientComponent implements OnInit {
  ngOnInit(): void {
    
  }
}
