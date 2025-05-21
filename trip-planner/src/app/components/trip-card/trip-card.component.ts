import {Component, Input} from '@angular/core';
import {Trip} from '../../models/trip';

@Component({
  selector: 'app-trip-card',
  standalone: false,
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.scss'
})
export class TripCardComponent {

  @Input() trip!: Trip;

}
