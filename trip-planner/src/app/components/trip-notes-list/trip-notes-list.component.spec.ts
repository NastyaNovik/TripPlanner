import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { TripNotesListComponent } from './trip-notes-list.component';

describe('TripNotesListComponent', () => {
  let component: TripNotesListComponent;
  let fixture: ComponentFixture<TripNotesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TripNotesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripNotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
