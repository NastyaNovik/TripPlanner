import {Component, OnInit} from '@angular/core';
import {TripService} from '../../services/trip.service';
import {Trip} from '../../models/trip';
import {Season} from '../../enums/season.enum';
import {SortLabel, SortOrder, SortOrderIcon} from '../../enums/sort-order.enum';

@Component({
  selector: 'app-trip-notes-list',
  standalone: false,
  templateUrl: './trip-notes-list.component.html',
  styleUrl: './trip-notes-list.component.scss'
})

export class TripNotesListComponent implements OnInit {
  upcomingTrips: Trip[] = [];
  pastTrips: Trip[] = [];
  upcomingSort = SortOrder.Asc;
  pastSort = SortOrder.Desc;
  season = Season;
  selectedUpcomingSeason = Season.All;
  selectedPastSeason = Season.All;
  filteredUpcomingTrips: Trip[] = [];
  filteredPastTrips: Trip[] = [];
  sortOrder = SortOrder;
  sortOrderIcon = SortOrderIcon;
  sortLabel = SortLabel;
  currentTabIndex: number = 0;

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  private loadTrips(): void{
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

  private getSeason(dateFrom: string): Season {
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

  private applySort(): void {
    this.upcomingTrips =this.sortTrips(this.upcomingTrips, this.upcomingSort);
    this.pastTrips =this.sortTrips(this.pastTrips, this.pastSort);
  }

  private sortTrips(trips: Trip[], orderBy: string): Trip[] {
    return [...trips].sort((a, b) => {
      const timeA = new Date(a.dateFrom).getTime();
      const timeB = new Date(b.dateFrom).getTime();
      return orderBy === SortOrder.Asc? timeA - timeB : timeB - timeA;
      });
  }

  upcomingSorting(): void {
    this.upcomingSort = this.upcomingSort === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc;
    this.upcomingTrips = this.sortTrips(this.upcomingTrips, this.upcomingSort);
    this.applyFilter();
  }

  pastSorting(): void {
    this.pastSort = this.pastSort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc;
    this.pastTrips = this.sortTrips(this.pastTrips, this.pastSort);
    this.applyFilter();
  }

  private applyFilter(): void {
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

  get upcomingSortLabel(): string {
    return this.upcomingSort === this.sortOrder.Asc
      ? this.sortLabel.UpcomingAsc
      : this.sortLabel.UpcomingDesc;
  }

  get upcomingSortIcon(): string {
    return this.upcomingSort === this.sortOrder.Asc
      ? this.sortOrderIcon.Asc
      : this.sortOrderIcon.Desc;
  }

  get pastSortLabel(): string {
    return this.pastSort === this.sortOrder.Desc
      ? this.sortLabel.PastDesc
      : this.sortLabel.PastAsc;
  }

  get pastSortIcon(): string {
    return this.pastSort === this.sortOrder.Asc
      ? this.sortOrderIcon.Asc
      : this.sortOrderIcon.Desc;
  }

  onTripDeleted(deletedId: string): void {
    this.filteredUpcomingTrips = this.filteredUpcomingTrips.filter(trip => trip.id !== deletedId);
    this.filteredPastTrips = this.filteredPastTrips.filter(trip => trip.id !== deletedId);
    this.upcomingTrips = this.upcomingTrips.filter(trip => trip.id !== deletedId);
    this.pastTrips = this.pastTrips.filter(trip => trip.id !== deletedId);
  }

  get currentSelectedSeason(): Season {
    return this.currentTabIndex === 0 ? this.selectedUpcomingSeason : this.selectedPastSeason;
  }

  set currentSelectedSeason(value: Season) {
    if (this.currentTabIndex === 0) {
      this.selectedUpcomingSeason = value;
    } else {
      this.selectedPastSeason = value;
    }
  }

  onTabChange(index: number): void {
    this.currentTabIndex = index;
  }

  onSortClick(): void {
    if (this.currentTabIndex === 0) {
      this.upcomingSorting();
    } else {
      this.pastSorting();
    }
  }
}
