import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { CategoriesComponentModule } from './components/categories/categories.component-module';
import { CreateCategoryComponentModule } from './components/create-category/create-category.component-module';
import { EditCategoryComponentModule } from './components/edit-category/edit-category.component-module';
import { CategoryDetailsComponentModule } from './components/category-details/category-details.component-module';
import { CreateTaskComponentModule } from './components/create-task/create-task.component-module';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'categories', component: CategoriesComponent },
      { path: 'categories/create', component: CreateCategoryComponent },
      { path: 'categories/edit/:categoryId', component: EditCategoryComponent },
      { path: 'categories/:categoryId', component: CategoryDetailsComponent },
      { path: 'tasks/create', component: CreateTaskComponent },
    ]),
    CategoriesComponentModule,
    CreateCategoryComponentModule,
    EditCategoryComponentModule,
    CategoryDetailsComponentModule,
    CreateTaskComponentModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
