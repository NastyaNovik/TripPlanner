import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { TripNoteEditorComponent } from './trip-note-editor.component';

describe('TripNoteEditorComponent', () => {
  let component: TripNoteEditorComponent;
  let fixture: ComponentFixture<TripNoteEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TripNoteEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripNoteEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
