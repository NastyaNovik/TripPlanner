import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { TripNotesListComponent } from './trip-notes-list.component';
import {TripService} from '../../services/trip.service';
import {of} from 'rxjs';
import {GoogleMap} from '../../models/map';
import {Season} from '../../enums/season.enum';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';
import {FormsModule} from '@angular/forms';
import {TripCardComponent} from '../trip-card/trip-card.component';
import {MatCardModule} from '@angular/material/card';

describe('TripNotesListComponent', () => {
  let component: TripNotesListComponent;
  let fixture: ComponentFixture<TripNotesListComponent>;
  let mockTripService: jasmine.SpyObj<TripService>;

  const trips = {
    upcoming:[
      {
        id: '1',
        title: 'Summer trip upcoming',
        dateFrom: '2025-08-01',
        dateTo: '2025-08-05',
        note: 'Some note',
        map: {} as GoogleMap,
        season: Season.All,
        checkList: [],
        expenses: []
      },
      {
        id: '2',
        title: 'Winter trip upcoming',
        dateFrom: '2026-01-15',
        dateTo: '2026-01-23',
        note: 'Some note',
        map: {} as GoogleMap,
        season: Season.All,
        checkList: [],
        expenses: []
      },
    ],
    past:[
      {
        id: '3',
        title: 'Autumn trip past',
        dateFrom: '2024-10-10',
        dateTo: '2024-10-13',
        note: 'Some note',
        map: {} as GoogleMap,
        season: Season.All,
        checkList: [],
        expenses: []
      },
      {
        id: '4',
        title: 'Spring trip past',
        dateFrom: '2024-04-20',
        dateTo: '2024-05-01',
        note: 'Some note',
        map: {} as GoogleMap,
        season: Season.All,
        checkList: [],
        expenses: []
      },
    ]
  };

  beforeEach(waitForAsync(() => {
    mockTripService = jasmine.createSpyObj('TripService', ['getTrips']);
    const getTripsSpy = mockTripService.getTrips.and.returnValue(of(trips));
    TestBed.configureTestingModule({
      declarations: [
        TripNotesListComponent,
        TripCardComponent
      ],
      imports: [
        MatIconModule,
        MatButtonToggleGroup,
        MatButtonToggle,
        MatTabGroup,
        MatTab,
        MatTabLabel,
        FormsModule,
        MatCardModule
      ],
      providers: [
        {provide: TripService, useValue: mockTripService},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripNotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load trips and assign seasons correctly', () => {
    expect(component.upcomingTrips.length).toBe(2);
    expect(component.pastTrips.length).toBe(2);

    expect(component.upcomingTrips[0].season).toBe(Season.Summer);
    expect(component.upcomingTrips[1].season).toBe(Season.Winter);
    expect(component.pastTrips[0].season).toBe(Season.Autumn);
    expect(component.pastTrips[1].season).toBe(Season.Spring);
  });

  it('should sort upcoming trips ascending by default', () => {
    const dates = component.upcomingTrips.map(t => t.dateFrom);
    expect(dates).toEqual(['2025-08-01', '2026-01-15']);
  });

  it('should sort past trips descending by default', () => {
    const dates = component.pastTrips.map(t => t.dateFrom);
    expect(dates).toEqual(['2024-10-10', '2024-04-20']);
  });

  it('should filter upcoming trips by selected season', () => {
    component.selectedUpcomingSeason = Season.Summer;
    component.onSeasonChange();
    expect(component.filteredUpcomingTrips.length).toBe(1);
    expect(component.filteredUpcomingTrips[0].season).toBe(Season.Summer);
  });

  it('should filter past trips by selected season', () => {
    component.selectedPastSeason = Season.Winter;
    component.onSeasonChange();
    expect(component.filteredPastTrips.length).toBe(0);
  });

  it('should delete a trip from trip array', () => {
    component.onTripDeleted('1');
    expect(component.filteredUpcomingTrips.length).toBe(1);
    expect(component.filteredUpcomingTrips.find(t => t.id === '0')).toBeUndefined();
  });

  it('should toggle sort order on upcoming trips', () => {
    const originalDates = component.upcomingTrips.map(t => t.dateFrom);
    component.upcomingSorting();
    const reversed = component.upcomingTrips.map(t => t.dateFrom);
    expect(reversed).toEqual(originalDates.reverse());
  });
});
