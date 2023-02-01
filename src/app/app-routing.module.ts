import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { CategoriesComponentModule } from './components/categories/categories.component-module';
import { CreateCategoryComponentModule } from './components/create-category/create-category.component-module';
import { EditCategoryComponentModule } from './components/edit-category/edit-category.component-module';
import { CategoryDetailsComponentModule } from './components/category-details/category-details.component-module';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'categories', component: CategoriesComponent },
      { path: 'categories/create', component: CreateCategoryComponent },
      { path: 'categories/edit/:categoryId', component: EditCategoryComponent },
      { path: 'categories/:categoryId', component: CategoryDetailsComponent },
    ]),
    CategoriesComponentModule,
    CreateCategoryComponentModule,
    EditCategoryComponentModule,
    CategoryDetailsComponentModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
