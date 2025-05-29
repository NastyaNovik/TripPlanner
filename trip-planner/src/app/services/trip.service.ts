import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, Observable, tap} from 'rxjs';
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
      tap(tripsWithImages => {
        localStorage.setItem('trips', JSON.stringify(tripsWithImages));
      }),
      map(tripsWithImages => {
        const now = new Date();
        return {
          upcoming: tripsWithImages.filter(trip => new Date(trip.dateFrom) >= now),
          past: tripsWithImages.filter(trip => new Date(trip.dateFrom) < now),
        };
      })
    );
  }

  getTripById(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  saveTrip(trip: Trip): Observable<Trip> {
    if(trip.id){
      return this.http.put<Trip>(`${this.apiUrl}/${trip.id}`, trip);
    }
    else{
      return this.createTrip(trip);
    }
  }

  private createTrip(trip: Trip): Observable<Trip> {
    const savedTrips = JSON.parse(localStorage.getItem('trips') || '[]');
    const maxId = savedTrips.length
      ? Math.max(...savedTrips.map((t: Trip) => t.id || 0))
      : 0;
    trip.id = (maxId + 1).toString();
    trip.dateFrom = "2026-04-08";
    trip.dateTo = "2026-05-09";
    const updatedTrips = [...savedTrips, trip];
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
    return this.http.post<Trip>(`${this.apiUrl}`, trip);
  }
}
