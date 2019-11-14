import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatGridListModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatTreeModule,
  MatTabsModule,
  MatToolbarModule,
  MatSelectModule,
  MatExpansionModule,
  MatIconModule,
  MatAutocompleteModule,
} from '@angular/material';

const materialModules = [
  CommonModule,
  CdkTableModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatGridListModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatTabsModule,
  MatTreeModule,
  MatToolbarModule,
  MatSelectModule,
  MatExpansionModule,
  MatIconModule,
  MatAutocompleteModule
];

@NgModule({
  imports: materialModules,
  exports: materialModules,
  declarations: []
})
export class MaterialModule { }
