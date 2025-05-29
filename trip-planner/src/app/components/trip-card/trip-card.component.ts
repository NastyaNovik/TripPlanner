import {Component, Input} from '@angular/core';
import {Trip} from '../../models/trip';
import {Season, SeasonIcon} from '../../enums/season.enum';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-trip-card',
  standalone: false,
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.scss'
})
export class TripCardComponent {
  @Input() trip!: Trip;
  seasonIcon = '';
  readonly dialogMessage = 'Are you sure you want to delete this trip?';

  constructor(
    private router: Router,
    private dialog: MatDialog) {}

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

  onDeleteTrip(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.dialogMessage,
      panelClass: 'custom-confirm-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       // this.deleteItem();
      }
    });
  }
}
