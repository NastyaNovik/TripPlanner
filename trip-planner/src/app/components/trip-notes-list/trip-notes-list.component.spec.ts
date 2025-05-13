import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripNotesListComponent } from './trip-notes-list.component';

describe('TripNotesListComponent', () => {
  let component: TripNotesListComponent;
  let fixture: ComponentFixture<TripNotesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripNotesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripNotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
