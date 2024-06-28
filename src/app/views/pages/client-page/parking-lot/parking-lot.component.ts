import { Component, OnInit } from '@angular/core';
import { SpinnerModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faParking } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-parking-lot',
  templateUrl: './parking-lot.component.html',
  styleUrl: 'parking-lot.component.scss',
  imports: [FontAwesomeModule, SpinnerModule],
  standalone: true
})
export class ParkingLotComponent implements OnInit{
  isShowSpinner: boolean = true;
  ngOnInit(): void {
    setTimeout(() => {
      this.isShowSpinner = false;
    }, 2000);
  }
  faParking = faParking;
}
