import {Component, ViewChild} from '@angular/core';
import {Trip} from '../../models/trip';
import {ActivatedRoute} from '@angular/router';
import {TripService} from '../../services/trip.service';
import {debounceTime, distinctUntilChanged, Subject, Subscription} from 'rxjs';
import {formatDate} from '@angular/common';
import {MapDirectionsService} from '@angular/google-maps';
import {map} from 'rxjs/operators';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {quillModules} from './quill-config';
import {CurrencyType} from '../../enums/currency';
import {MatTableDataSource} from '@angular/material/table';
import {Expense} from '../../models/expense';
import {MatPaginator} from '@angular/material/paginator';
import {CurrencyService} from '../../services/currency.service';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-trip-note-editor',
  standalone: false,
  templateUrl: './trip-note-editor.component.html',
  styleUrl: './trip-note-editor.component.scss'
})
export class TripNoteEditorComponent {
  trip!: Trip;
  saveSubject = new Subject<Trip>();
  saveSubscription!: Subscription;
  center!: google.maps.LatLngLiteral;
  zoom!: number;
  markers: google.maps.LatLngLiteral[] = [];
  bounds!: google.maps.LatLngBounds;
  map!: google.maps.Map;
  directionsResults!: google.maps.DirectionsResult | undefined;
  directionsRenderOption!: google.maps.DirectionsRendererOptions;
  dataSource:MatTableDataSource<FormGroup>=new MatTableDataSource<FormGroup>()
  currencies = [CurrencyType.PLN, CurrencyType.USD, CurrencyType.EUR];
  displayedColumns = ['description', 'amount', 'currency', 'actions'];
  selectedCurrency = CurrencyType.PLN;
  convertedTotal = 0;
  formArray: FormArray<FormGroup> = new FormArray<FormGroup>([]);
  isTitleInvalid = false;
  isDateRangeInvalid = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private directionsService: MapDirectionsService,
    private currencyService: CurrencyService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.tripService.getTripById(id).subscribe(trip => {
        this.trip = trip;
        this.setGoogleMapsMarkers(this.trip);
      });
    }
    else {
      const { tomorrow, afterTomorrow } = this.getDefaultDates();
      this.trip = {
        id: '',
        dateFrom: tomorrow,
        dateTo: afterTomorrow,
        checkList: [],
        expenses: [],
      } as unknown as Trip;
      this.setGoogleMapsMarkers(this.trip);
    }

    this.saveSubscription = this.saveSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(tripToSave => {
      this.tripService.saveTrip(tripToSave).subscribe(savedTrip => {this.trip = savedTrip;});
    });

    this.directionsRenderOption = this.getDirectionsRenderOptions();
    this.currencyService.fetchRates(CurrencyType.PLN).subscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.formArray=new FormArray(this.trip.expenses.map(expense => this.getFormGroup(expense)));
      this.dataSource=new MatTableDataSource(this.formArray.controls)
      this.dataSource.paginator = this.paginator;
      this.calculateTotal();
    }, 500);
  }

  getFormGroup(data:Expense): FormGroup
  {
    const fg = new FormGroup({
      description:new FormControl(data.description),
      amount:new FormControl(data.amount),
      currency:new FormControl(data.currency),
    })
    fg.valueChanges.subscribe(val => {
      const index = this.formArray.controls.indexOf(fg);
      if (index > -1) {
        this.trip.expenses[index] = {
          description: val.description ?? '',
          amount: val.amount ?? 0,
          currency: val.currency ?? CurrencyType.PLN,
        };
        this.onContentChange();
      }
    });

    return fg;
  }

  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }

  onContentChange(): void {
    if(!this.trip?.title?.trim()){
      this.isTitleInvalid = true;
      return;
    }
    const updatedTrip = {
      ...this.trip,
      title: this.trip.title,
      note: this.trip.note,
      map: {
        markers: this.markers,
      },
      dateFrom: formatDate(this.trip.dateFrom, 'yyyy-MM-dd', 'en'),
      dateTo: formatDate(this.trip.dateTo, 'yyyy-MM-dd', 'en'),
      checkList: this.trip.checkList,
      expenses: this.trip.expenses,
    };
    this.isTitleInvalid = false;
    this.isDateRangeInvalid = false;
    this.calculateTotal();
    this.saveSubject.next(updatedTrip);
  }

  quillModules = quillModules;

  private getDirectionsRenderOptions(): google.maps.DirectionsRendererOptions {
    return {
      suppressMarkers: true,
      suppressInfoWindows: true,
      polylineOptions: {
        strokeColor: '#6d8dbd',
        strokeOpacity: 0,
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillOpacity: 1,
              scale: 3,
            },
            offset: '0',
            repeat: '1px',
          },
        ],
      },
    };
  }

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

  private getDefaultDates(){
    const tomorrow = new Date();
    const afterTomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    afterTomorrow.setDate(tomorrow.getDate() + 1);

    return {tomorrow, afterTomorrow};
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
    this.trip.dateFrom = formatDate(this.trip.dateFrom, 'yyyy-MM-dd', 'en');
    this.trip.dateTo = formatDate(this.trip.dateTo, 'yyyy-MM-dd', 'en');

    this.isDateRangeInvalid = this.trip.dateTo < this.trip.dateFrom;

    if(!this.isDateRangeInvalid)
      this.onContentChange();
  }

  addTask(): void {
    this.trip.checkList.push({ task: '', completed: false });
  }

  removeTask(index: number): void {
    this.trip.checkList.splice(index, 1);
    this.onContentChange();
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.trip.checkList, event.previousIndex, event.currentIndex);
    this.onContentChange();
  }

  addExpense(): void {
    const newExpense = this.getFormGroup({ description: '', amount: 0, currency: CurrencyType.PLN });
    this.formArray.push(newExpense);
    this.dataSource.data = this.formArray.controls;
    this.trip.expenses.push({ description: '', amount: 0, currency: CurrencyType.PLN });
  }

  removeExpense(index: number): void {
    this.trip.expenses.splice(index, 1);
    this.formArray.removeAt(index);
    this.dataSource.data = this.formArray.controls;
    this.onContentChange();
  }

  calculateTotal(): void {
    if (!this.trip?.expenses) return;

    const total = this.trip.expenses.reduce((sum, exp) => {
      return sum + this.currencyService.convert(exp.amount, exp.currency, this.selectedCurrency);
    }, 0);
    this.convertedTotal = Number(total.toFixed(2));
  }
}
