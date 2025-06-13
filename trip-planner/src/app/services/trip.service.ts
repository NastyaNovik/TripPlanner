import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, Observable, of, tap} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Trip } from '../models/trip';
import { TripsByDateStatus } from '../models/trips-by-date-status';
import { ImageSearchService } from './image-search.service';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = 'http://localhost:3000/trips';
  private readonly cacheTripKey = 'trips';

  constructor(private http: HttpClient, private imageSearch: ImageSearchService) { }

  getTrips(): Observable<TripsByDateStatus> {
    const cached = localStorage.getItem(this.cacheTripKey);

    if (cached) {
      const trips = JSON.parse(cached);
      return of(this.groupTripsByDate(trips));
    }

    return this.http.get<Trip[]>(this.apiUrl).pipe(
      switchMap(trips => {
        const tripsWithImages$ = trips.map(trip => {
          if (trip.imageUrl) {
            return of(trip);
          }
          return this.imageSearch.searchImage(trip.title).pipe(
            map(imageUrl => ({ ...trip, imageUrl }))
          );
        });
        return forkJoin(tripsWithImages$);
      }),
      tap(tripsWithImages => {
        localStorage.setItem(this.cacheTripKey, JSON.stringify(tripsWithImages));
      }),
      map(trips => this.groupTripsByDate(trips))
    );
  }

  getTripById(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  saveTrip(trip: Trip): Observable<Trip> {
    return this.imageSearch.searchImage(trip.title).pipe(
      switchMap(imageUrl => {
        const tripWithImage = { ...trip, imageUrl };
        if (trip.id) {
          return this.http.put<Trip>(`${this.apiUrl}/${trip.id}`, tripWithImage).pipe(
            tap(updated => this.updateLocalTrip(updated))
          );
        } else {
          return this.createTrip(tripWithImage);
        }
      })
    );
  }

  deleteTrip(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const tripsWithoutDeletedItem = this.getLocalTrips().filter(trip => trip.id !== id);
        localStorage.setItem(this.cacheTripKey, JSON.stringify(tripsWithoutDeletedItem));
      })
    );
  }

  private createTrip(trip: Trip): Observable<Trip> {
    const savedTrips = JSON.parse(localStorage.getItem(this.cacheTripKey) || '[]');
    const maxId = savedTrips.length
      ? Math.max(...savedTrips.map((savedTrip: Trip) => savedTrip.id || 0))
      : 0;
    trip.id = (maxId + 1).toString();
    const updatedTrips = [...savedTrips, trip];
    localStorage.setItem(this.cacheTripKey, JSON.stringify(updatedTrips));
    return this.http.post<Trip>(`${this.apiUrl}`, trip);
  }

  private updateLocalTrip(updatedTrip: Trip) {
    const trips = this.getLocalTrips();
    const updatedTrips = trips.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip);
    localStorage.setItem(this.cacheTripKey, JSON.stringify(updatedTrips));
  }

  private getLocalTrips(): Trip[] {
    return JSON.parse(localStorage.getItem(this.cacheTripKey) || '[]');
  }

  private groupTripsByDate(trips: Trip[]): TripsByDateStatus {
    const now = new Date();
    return {
      upcoming: trips.filter(trip => new Date(trip.dateFrom) >= now),
      past: trips.filter(trip => new Date(trip.dateFrom) < now),
    };
  }
}
