import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { concatMap, Observable, take } from 'rxjs';
import { TasksService } from 'src/app/services/tasks.service';
import { CategoryModel } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-create-task',
  styleUrls: ['./create-task.component.scss'],
  templateUrl: './create-task.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskComponent {
  constructor(
    private _categoriesService: CategoriesService,
    private _tasksService: TasksService,
    private _router: Router
  ) {}

  readonly createTaskForm: FormGroup = new FormGroup({
    // TODO: Move the letter-only validator pattern to a separate directory
    name: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z ]*$'),
    ]),
    category: new FormControl('', [Validators.required]),
  });

  readonly categories$: Observable<CategoryModel[]> =
    this._categoriesService.getAllCategories();

  get currentlySelectedCategory(): string {
    return this.createTaskForm.controls.category.value;
  }

  compareCategories(a: string, b: CategoryModel): boolean {
    return a === b.id;
  }

  onCreateTaskFormSubmitted(createTaskForm: FormGroup): void {
    if (createTaskForm.valid) {
      console.log(createTaskForm.value);
      this._tasksService
        .createTask({
          name: createTaskForm.controls.name.value,
          categoryId: createTaskForm.controls.category.value,
        })
        .pipe(
          take(1),
          concatMap((form) =>
            this._router.navigate([`categories/${form.categoryId}`])
          )
        )
        .subscribe();
    }
  }
}
