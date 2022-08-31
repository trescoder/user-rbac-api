import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

const commonUtils = [
  FormsModule,
  ReactiveFormsModule,
  NgxSkeletonLoaderModule,
  MatListModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatButtonModule,
  MatInputModule,
  MatAutocompleteModule,
  MatSnackBarModule,
  MatCardModule,
  MatToolbarModule,
  MatSelectModule,
];

@NgModule({
  imports: [CommonModule, ...commonUtils],
  exports: [...commonUtils],
})
export class GlobalModule {}
