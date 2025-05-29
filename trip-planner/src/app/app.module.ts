import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TripNotesListComponent } from './components/trip-notes-list/trip-notes-list.component';
import { TripNoteEditorComponent } from './components/trip-note-editor/trip-note-editor.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TripCardComponent } from './components/trip-card/trip-card.component';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AppComponent,
    TripNotesListComponent,
    TripNoteEditorComponent,
    NavbarComponent,
    TripCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    NgOptimizedImage,
    MatIconModule,
    MatButton,
    MatFabButton,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    QuillModule.forRoot(),
    MatIconButton
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
