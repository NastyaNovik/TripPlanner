import {Component, Input} from '@angular/core';
import {Trip} from '../../models/trip';
import {Season, SeasonIcon} from '../../enums/season.enum';
import {Router} from '@angular/router';

@Component({
  selector: 'app-trip-card',
  standalone: false,
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.scss'
})
export class TripCardComponent {
  @Input() trip!: Trip;

  seasonIcon = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.seasonIcon = this.getSeasonIcon(this.trip.season);
  }

  private getSeasonIcon(season: string): string {
    switch (season) {
      case Season.Spring:
        return SeasonIcon.Spring;
      case Season.Summer:
        return SeasonIcon.Summer;
      case Season.Autumn:
        return SeasonIcon.Autumn;
      case Season.Winter:
        return SeasonIcon.Winter;
      default:
        return '';
    }
  }

  openNote(trip: Trip): void {
    this.router.navigate([`/note/${trip.id}`],{
      state: {trip}
    });
  }
}
