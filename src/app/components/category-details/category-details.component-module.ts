import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CategoryDetailsComponent } from './category-details.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatListModule,
  ],
  declarations: [CategoryDetailsComponent],
  providers: [],
  exports: [CategoryDetailsComponent],
})
export class CategoryDetailsComponentModule {}
