import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrl: 'nav-header.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [RouterModule, FontAwesomeModule]
})
export class NavHeaderComponent implements OnInit {
  pageLink = {
    aboutUs: "about-us"
  }
  ngOnInit(): void {
  }
}
