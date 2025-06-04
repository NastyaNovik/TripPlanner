import {Component} from '@angular/core';
import {Trip} from '../../models/trip';
import {ActivatedRoute, Router} from '@angular/router';
import {TripService} from '../../services/trip.service';
import {debounceTime, distinctUntilChanged, Subject, Subscription} from 'rxjs';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-trip-note-editor',
  standalone: false,
  templateUrl: './trip-note-editor.component.html',
  styleUrl: './trip-note-editor.component.scss'
})
export class TripNoteEditorComponent {
  trip!: Trip;
  noteContent = '';
  tripTitle = '';
  private saveSubject = new Subject<Trip>();
  private saveSubscription!: Subscription;
  center!: google.maps.LatLngLiteral;
  zoom!: number;
  markers: google.maps.LatLngLiteral[] = [];
  bounds!: google.maps.LatLngBounds;
  map!: google.maps.Map;
  dateFrom!: Date;
  dateTo!: Date;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const tripFromState = nav?.extras.state?.['trip'];
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (tripFromState) {
      this.trip = tripFromState;
      this.tripTitle = tripFromState.title || '';
      this.noteContent = tripFromState.note || '';
      this.setGoogleMapsMarkers(this.trip);
      this.dateFrom = new Date(this.trip.dateFrom);
      this.dateTo = new Date(this.trip.dateTo);
    }
    else if (id) {
      this.tripService.getTripById(id).subscribe(trip => {
        this.trip = trip;
        this.tripTitle = trip.title || '';
        this.noteContent = trip.note || '';
        this.setGoogleMapsMarkers(this.trip);
        this.dateFrom = new Date(this.trip.dateFrom);
        this.dateTo = new Date(this.trip.dateTo);
      });
    }
    else {
      const tomorrow = new Date();
      const afterTomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      afterTomorrow.setDate(tomorrow.getDate() + 1);

      this.dateFrom = tomorrow;
      this.dateTo = afterTomorrow;
      this.trip = {
        id: '',
      } as Trip;
      this.setGoogleMapsMarkers(this.trip);
    }

    this.saveSubscription = this.saveSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(tripToSave => {
      this.tripService.saveTrip(tripToSave).subscribe(savedTrip => {this.trip = savedTrip;});
    });
  }

  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }

  onContentChange(): void {
    if(!this.tripTitle){
      return;
    }
    const updatedTrip = {
      ...this.trip,
      title: this.tripTitle,
      note: this.noteContent,
      map: {
        markers: this.markers,
      },
      dateFrom: formatDate(this.dateFrom, 'yyyy-MM-dd', 'en'),
      dateTo: formatDate(this.dateTo, 'yyyy-MM-dd', 'en'),
    };
    this.saveSubject.next(updatedTrip);
  }

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  private setGoogleMapsMarkers(trip: Trip): void {
    const tripMarkers = trip.map?.markers ?? [];
    this.markers = [...tripMarkers];
    navigator.geolocation.getCurrentPosition((position) => {
      const currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      if(this.markers.length === 0) {
        this.markers.push(currentLocation);
      }
      if (this.markers.length === 1) {
        this.center = currentLocation;
        this.zoom = 10;
        console.log(tripMarkers);
        console.log(this.markers);
      } else {
        this.bounds = new google.maps.LatLngBounds();
        this.markers.forEach(marker =>
          this.bounds.extend(new google.maps.LatLng(marker.lat, marker.lng))
        );
        if (this.map) {
          this.map.fitBounds(this.bounds);
          this.correctZoom();
        }
      }
    });
  }

  private correctZoom(): void {
    google.maps.event.addListenerOnce(this.map, 'bounds_changed', () => {
      if (this.map.getZoom()! > 14) {
        this.map.setZoom(14);
      }
    });
  }
  addMarker(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      this.markers.push({ lat, lng });
      this.onContentChange();
    }
  }

  onMapInitialized(mapInstance: google.maps.Map): void {
    this.map = mapInstance;

    if (this.bounds) {
      this.map.fitBounds(this.bounds);
      this.correctZoom();
    }
  }

  removeMarker(i: number): void {
    this.markers.splice(i, 1);
    this.onContentChange();
  }

  onDateChange(): void {
    this.trip.dateFrom = formatDate(this.dateFrom, 'yyyy-MM-dd', 'en');
    this.trip.dateTo = formatDate(this.dateTo, 'yyyy-MM-dd', 'en');

    this.onContentChange();
  }
}
