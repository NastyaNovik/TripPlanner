import {Component} from '@angular/core';
import {Trip} from '../../models/trip';
import {ActivatedRoute} from '@angular/router';
import {TripService} from '../../services/trip.service';
import {debounceTime, distinctUntilChanged, Subject, Subscription} from 'rxjs';
import {formatDate} from '@angular/common';
import {MapDirectionsService} from '@angular/google-maps';
import { map } from 'rxjs/operators';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {CheckList} from '../../models/check-list';

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
  directionsResults!: google.maps.DirectionsResult | undefined;
  directionsRenderOption!: google.maps.DirectionsRendererOptions
  checkList: CheckList[] = [];

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private directionsService: MapDirectionsService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.tripService.getTripById(id).subscribe(trip => {
        this.trip = trip;
        this.tripTitle = trip.title || '';
        this.noteContent = trip.note || '';
        this.setGoogleMapsMarkers(this.trip);
        this.dateFrom = new Date(this.trip.dateFrom);
        this.dateTo = new Date(this.trip.dateTo);
        this.checkList = this.trip.checkList || [];
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

    this.directionsRenderOption = {
      suppressMarkers:true,
      suppressInfoWindows:true,
      polylineOptions:{
        strokeColor: '#6d8dbd',
        strokeOpacity: 0,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 1,
            scale: 3
          },
          offset: '0',
          repeat: '1px'
        }],
      }
    }
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
      checkList: this.checkList,
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
    this.updateRoute();
  }

  private updateRoute(): void {
    if (this.markers.length < 2) return;

    const waypoints = this.markers.slice(1, -1).map(position => ({
      location: position,
      stopover: true
    }));

    const request: google.maps.DirectionsRequest = {
      origin: this.markers[0],
      destination: this.markers[this.markers.length - 1],
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request).pipe(
      map(res => res.result)
    ).subscribe(directions => {
      this.directionsResults = directions;
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
      this.updateRoute();
      this.onContentChange();
      this.onMapInitialized(this.map);
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
    this.updateRoute();
    this.onContentChange();
    this.onMapInitialized(this.map);
  }

  onDateChange(): void {
    this.trip.dateFrom = formatDate(this.dateFrom, 'yyyy-MM-dd', 'en');
    this.trip.dateTo = formatDate(this.dateTo, 'yyyy-MM-dd', 'en');

    this.onContentChange();
  }

  addTask(): void {
    this.checkList.push({ task: '', completed: false });
  }

  removeTask(index: number): void {
    this.checkList.splice(index, 1);
    this.onContentChange();
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.checkList, event.previousIndex, event.currentIndex);
    this.onContentChange();
  }
}
