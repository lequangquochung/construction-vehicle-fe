import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselComponent, CarouselControlComponent, CarouselInnerComponent, CarouselItemComponent, SpinnerModule } from '@coreui/angular';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: 'about-us.component.scss',
  standalone: true,
  imports: [SpinnerModule, CarouselComponent, CarouselInnerComponent, CarouselItemComponent, CarouselControlComponent, RouterLink, NgFor]
})
export class AboutUsComponent implements OnInit {
  slides: any[] = new Array(3).fill({ id: -1, src: '', title: '', subtitle: '' });
  isShowSpinner: boolean = true;

  ngOnInit(): void {
    this.slides[0] = {
      src: '/assets/images/construction-vehicles.jpg'
    };
    this.slides[1] = {
      src: '/assets/images/construction-vehicles.jpg'
    };
    this.slides[2] = {
      src: '/assets/images/construction-vehicles.jpg'
    };
    setTimeout(() => {
      this.isShowSpinner = false;
    }, 2000);
  }
}
