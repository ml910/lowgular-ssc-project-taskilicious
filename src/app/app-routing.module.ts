import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { CategoriesComponentModule } from './components/categories/categories.component-module';
import { CreateCategoryComponentModule } from './components/create-category/create-category.component-module';
import { EditCategoryComponentModule } from './components/edit-category/edit-category.component-module';
import { CategoryDetailsComponentModule } from './components/category-details/category-details.component-module';
import { CreateTaskComponentModule } from './components/create-task/create-task.component-module';
import { EditTaskComponentModule } from './components/edit-task/edit-task.component-module';

// If you have the error below in the console after creating a component, just restart npm run start - it will work then
// error NG6002: This import contains errors, which may affect components that depend on this NgModule.
@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: CategoriesComponent },
      { path: 'categories/create', component: CreateCategoryComponent },
      { path: 'categories/edit/:categoryId', component: EditCategoryComponent },
      { path: 'categories/:categoryId', component: CategoryDetailsComponent },
      { path: 'tasks/create', component: CreateTaskComponent },
      { path: 'tasks/edit/:taskId', component: EditTaskComponent },
    ]),
    CategoriesComponentModule,
    CreateCategoryComponentModule,
    EditCategoryComponentModule,
    CategoryDetailsComponentModule,
    CreateTaskComponentModule,
    EditTaskComponentModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
