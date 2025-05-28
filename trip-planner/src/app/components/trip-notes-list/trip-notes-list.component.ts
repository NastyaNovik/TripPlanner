import {Component, OnInit} from '@angular/core';
import {TripService} from '../../services/trip.service';
import {Trip} from '../../models/trip';
import {Season} from '../../enums/season.enum';

@Component({
  selector: 'app-trip-notes-list',
  standalone: false,
  templateUrl: './trip-notes-list.component.html',
  styleUrl: './trip-notes-list.component.scss'
})

export class TripNotesListComponent implements OnInit {
  upcomingTrips: Trip[] = [];
  pastTrips: Trip[] = [];
  upcomingSort ='asc';
  pastSort ='desc';
  season = Season;
  selectedUpcomingSeason = Season.All;
  selectedPastSeason = Season.All;
  filteredUpcomingTrips: Trip[] = [];
  filteredPastTrips: Trip[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.tripService.getTrips().subscribe(({ upcoming, past }) => {
      this.upcomingTrips = upcoming.map(trip => ({
        ...trip,
        season: this.getSeason(trip.dateFrom)
      }));

      this.pastTrips = past.map(trip => ({
        ...trip,
        season: this.getSeason(trip.dateFrom)
      }));

      this.filteredUpcomingTrips = [...this.upcomingTrips];
      this.filteredPastTrips = [...this.pastTrips];

      this.applySort();
      this.applyFilter();
    });
  }

  getSeason(dateFrom: string): Season {
    const month = parseInt(dateFrom.split('-')[1]);
    switch(month){
      case 12:
      case 1:
      case 2:
          return Season.Winter;
      case 3:
      case 4:
      case 5:
        return Season.Spring;
      case 6:
      case 7:
      case 8:
        return Season.Summer;
      case 9:
      case 10:
      case 11:
        return Season.Autumn;
      default:
        return Season.All;
    }
  }

  applySort(): void {
    this.upcomingTrips =this.sortTrips(this.upcomingTrips, this.upcomingSort);
    this.pastTrips =this.sortTrips(this.pastTrips, this.pastSort);
  }

  sortTrips(trips: Trip[], orderBy: string): Trip[] {
    return [...trips].sort((a, b) => {
      const timeA = new Date(a.dateFrom).getTime();
      const timeB = new Date(b.dateFrom).getTime();
      return orderBy === 'asc'? timeA - timeB : timeB - timeA;
      });
  }

  upcomingSorting(): void {
    this.upcomingSort = this.upcomingSort === 'asc' ? 'desc' : 'asc';
    this.upcomingTrips = this.sortTrips(this.upcomingTrips, this.upcomingSort);
    this.applyFilter();
  }

  pastSorting(): void {
    this.pastSort = this.pastSort === 'desc' ? 'asc' : 'desc';
    this.pastTrips = this.sortTrips(this.pastTrips, this.pastSort);
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredUpcomingTrips = this.selectedUpcomingSeason
      ? this.upcomingTrips.filter(trip => trip.season === this.selectedUpcomingSeason)
      : this.upcomingTrips;

    this.filteredPastTrips = this.selectedPastSeason
      ? this.pastTrips.filter(trip => trip.season === this.selectedPastSeason)
      : this.pastTrips;
  }

  onSeasonChange(): void {
    this.applyFilter();
  }
}
