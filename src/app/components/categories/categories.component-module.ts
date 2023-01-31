import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { CategoriesComponent } from './categories.component';

@NgModule({
  imports: [MatListModule, CommonModule],
  declarations: [CategoriesComponent],
  providers: [],
  exports: [CategoriesComponent],
})
export class CategoriesComponentModule {}
