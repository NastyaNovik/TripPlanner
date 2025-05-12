import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TripNotesListComponent} from './trip-notes-list/trip-notes-list.component';
import {TripNoteEditorComponent} from './trip-note-editor/trip-note-editor.component';

const routes: Routes = [
  { path: '', component: TripNotesListComponent },
  { path: 'create', component: TripNoteEditorComponent },
  { path: ':id/edit', component: TripNoteEditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
