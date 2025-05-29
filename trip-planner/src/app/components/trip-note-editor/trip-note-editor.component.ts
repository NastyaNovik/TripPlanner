import {Component} from '@angular/core';
import {Trip} from '../../models/trip';
import {ActivatedRoute, Router} from '@angular/router';
import {TripService} from '../../services/trip.service';
import {debounceTime, distinctUntilChanged, Subject, Subscription} from 'rxjs';

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
    }
    else if (id) {
      this.tripService.getTripById(id).subscribe(trip => {
        this.trip = trip;
        this.tripTitle = trip.title || '';
        this.noteContent = trip.note || '';
      });
    }
    else {
      this.trip = {
        id: '',
        title: '',
        dateFrom: '',
        dateTo: '',
        imageUrl: '',
        note: ''
      } as Trip;
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
    const updatedTrip = {
      ...this.trip,
      title: this.tripTitle,
      note: this.noteContent
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
}
