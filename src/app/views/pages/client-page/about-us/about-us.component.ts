import { NgFor, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselComponent, CarouselControlComponent, CarouselInnerComponent, CarouselItemComponent, SpinnerModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressCard, faPager, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Slides } from '../nav-header/nav-header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: 'about-us.component.scss',
  standalone: true,
  imports: [SpinnerModule, CarouselComponent, CarouselInnerComponent,
    FontAwesomeModule,
    TranslateModule, UpperCasePipe,
    CarouselItemComponent, CarouselControlComponent, RouterLink, NgFor]
})
export class AboutUsComponent implements OnInit {
  slides: Slides[] = [
    {
      title: "",
      src: "/assets/images/slides/1.jpg"
    },
    {
      title: "",
      src: "/assets/images/slides/2.jpg"
    },
    {
      title: "",
      src: "/assets/images/slides/3.jpg"
    },
    {
      title: "",
      src: "/assets/images/slides/5.jpg"
    }
  ];
  isShowSpinner: boolean = true;
  faIcon = {
    faAddressCard: faAddressCard,
    faPhone: faPhone,
    faPager: faPager
  }
  ngOnInit(): void {

    setTimeout(() => {
      this.isShowSpinner = false;
    }, 2000);
  }
}
