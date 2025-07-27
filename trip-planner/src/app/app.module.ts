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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { MatCheckbox } from '@angular/material/checkbox';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatFooterCell, MatFooterCellDef, MatFooterRow, MatFooterRowDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSelect} from '@angular/material/select';

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
    CdkDrag,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatFooterCell,
    MatFooterCellDef,
    MatFooterRow,
    MatFooterRowDef,
    MatPaginator,
    MatSelect,
    MatOption,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
