import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-footer',
  templateUrl: './nav-footer.component.html',
  styleUrl: 'nav-footer.component.scss',
  standalone: true,
  imports : [TranslateModule, UpperCasePipe]
})
export class NavFooterComponent {
  email = 'cogioiducanh77@gmail.com'
}
