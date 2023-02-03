import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { CategoryDetailsComponent } from './category-details.component';

@NgModule({
  imports: [CommonModule, MatProgressSpinnerModule, MatTableModule],
  declarations: [CategoryDetailsComponent],
  providers: [],
  exports: [CategoryDetailsComponent],
})
export class CategoryDetailsComponentModule {}
