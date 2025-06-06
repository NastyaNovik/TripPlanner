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
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { MatCheckbox } from '@angular/material/checkbox';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    TripNotesListComponent,
    TripNoteEditorComponent,
    NavbarComponent,
    TripCardComponent,
    ConfirmDialogComponent
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
    MatIconButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    GoogleMapsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatCheckbox,
    CdkDropList,
    CdkDrag
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
