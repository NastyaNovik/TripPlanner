import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Trip} from '../../models/trip';
import {Season, SeasonIcon} from '../../enums/season.enum';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../shared/confirm-dialog/confirm-dialog.component';
import {TripService} from '../../services/trip.service';
import {filter, take} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-trip-card',
  standalone: false,
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.scss'
})
export class TripCardComponent {
  @Input() trip!: Trip;
  @Output() onDelete = new EventEmitter();

  readonly dialogMessage = 'Are you sure you want to delete this trip?';
  seasonIcon = '';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private tripService: TripService) {}

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

  openTripNote(trip: Trip): void {
    this.router.navigate([`/note/${trip.id}`],{
      state: {trip}
    });
  }

  onDeleteTrip(): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: this.dialogMessage,
      panelClass: 'custom_confirm_dialog',
    }).afterClosed().pipe(
      take(1),
      filter(result => !!result),
      switchMap(() => this.tripService.deleteTrip(this.trip.id))
    ).subscribe(() => {
      this.onDelete.emit(this.trip.id);
    });
  }
}
