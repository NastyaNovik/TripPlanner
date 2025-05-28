import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Trip } from '../models/trip';
import { TripsByDateStatus } from '../models/trips-by-date-status';
import { ImageSearchService } from './image-search.service';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = 'http://localhost:3000/trips';

  constructor(private http: HttpClient, private imageSearch: ImageSearchService) { }

  getTrips(): Observable<TripsByDateStatus> {
    return this.http.get<Trip[]>(this.apiUrl).pipe(
      switchMap(trips =>
        forkJoin(
          trips.map(trip =>
            this.imageSearch.searchImage(trip.title).pipe(
              map(imageUrl => ({ ...trip, imageUrl }))
            )
          )
        )
      ),
      map(tripsWithImages => {
        const now = new Date();
        return {
          upcoming: tripsWithImages.filter(trip => new Date(trip.dateFrom) >= now),
          past: tripsWithImages.filter(trip => new Date(trip.dateFrom) < now),
        };
      })
    );
  }
}
