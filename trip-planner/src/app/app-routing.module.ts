import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TripNotesListComponent} from './components/trip-notes-list/trip-notes-list.component';
import {TripNoteEditorComponent} from './components/trip-note-editor/trip-note-editor.component';

const routes: Routes = [
  { path: '', component: TripNotesListComponent },
  { path: 'note', component: TripNoteEditorComponent },
  { path: 'note/:id', component: TripNoteEditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
