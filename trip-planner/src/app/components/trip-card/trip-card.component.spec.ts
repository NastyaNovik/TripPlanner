import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { TripCardComponent } from './trip-card.component';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {GoogleMap} from '../../models/map';
import {Season} from '../../enums/season.enum';

describe('TripCardComponent', () => {
  let component: TripCardComponent;
  let fixture: ComponentFixture<TripCardComponent>;

  const trip = {
      id: '1',
      title: 'Summer trip upcoming',
      dateFrom: '2025-08-01',
      dateTo: '2025-08-05',
      note: 'Some note',
      map: {} as GoogleMap,
      season: Season.All,
      checkList: [],
      expenses: []
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TripCardComponent],
      imports: [
        MatIconModule,
        MatCardModule
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi())
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripCardComponent);
    component = fixture.componentInstance;
    component.trip = trip;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
