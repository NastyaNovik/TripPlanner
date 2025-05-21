import {Component, OnInit} from '@angular/core';
import {TripService} from '../../services/trip.service';
import {Trip} from '../../models/trip';

@Component({
  selector: 'app-trip-notes-list',
  standalone: false,
  templateUrl: './trip-notes-list.component.html',
  styleUrl: './trip-notes-list.component.scss'
})

export class TripNotesListComponent implements OnInit {
  upcomingTrips: Trip[] = [];
  pastTrips: Trip[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit() {
    this.tripService.getTrips().subscribe(({ upcoming, past }) => {
      this.upcomingTrips = upcoming.map(trip => ({
        ...trip,
        season: this.getSeason(trip.dateFrom)
      }));

      this.pastTrips = past.map(trip => ({
        ...trip,
        season: this.getSeason(trip.dateFrom)
      }));
    });
  }

  getSeason(dateFrom: string){
    const month = parseInt(dateFrom.split('-')[1]);
    switch(month){
      case 12:
      case 1:
      case 2:
          return 'winter';
      case 3:
      case 4:
      case 5:
        return 'spring';
      case 6:
      case 7:
      case 8:
        return 'summer';
      case 9:
      case 10:
      case 11:
        return 'autumn';
      default:
        return 'summer';
    }
  }
}
