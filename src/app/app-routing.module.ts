import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoriesComponentModule } from './components/categories/categories.component-module';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'categories', component: CategoriesComponent },
    ]),
    CategoriesComponentModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
