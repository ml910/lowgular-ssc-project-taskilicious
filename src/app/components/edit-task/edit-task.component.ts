import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { concatMap, switchMap, take, tap } from 'rxjs/operators';
import { CategoryModel } from '../../models/category.model';
import { TasksService } from '../../services/tasks.service';
import { CategoriesService } from '../../services/categories.service';
import { TaskModel } from '../../models/task.model';
import { CustomValidators } from 'src/app/custom-validators.enum';

@Component({
  selector: 'app-edit-task',
  styleUrls: ['./edit-task.component.scss'],
  templateUrl: './edit-task.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTaskComponent {
  constructor(
    private _tasksService: TasksService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _categoriesService: CategoriesService
  ) {}

  readonly editTaskForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(CustomValidators.LETTERS_ONLY),
    ]),
    category: new FormControl('', Validators.required),
  });

  readonly task$: Observable<TaskModel> = this._activatedRoute.params.pipe(
    switchMap((params: Params) =>
      this._tasksService.getOneById(params['taskId'])
    ),
    tap((taskDetails: TaskModel) => {
      this.editTaskForm.patchValue({
        name: taskDetails.name,
        category: taskDetails.categoryId,
      });
    })
  );

  readonly availableCategories$: Observable<CategoryModel[]> =
    this._categoriesService.getAllCategories();

  onEditTaskFormSubmitted(editTaskForm: FormGroup): void {
    if (editTaskForm.valid) {
      this._activatedRoute.params
        .pipe(
          switchMap((params: Params) =>
            this._tasksService.editTaskById(
              editTaskForm.controls.category.value,
              {
                name: editTaskForm.controls.name.value,
                categoryId: editTaskForm.controls.category.value,
                id: params['taskId'],
              }
            )
          ),
          // Take and switchMap emission order
          // https://itnext.io/where-to-place-rxjs-operator-take-1-39a8a00f65cb
          take(1),
          concatMap(() =>
            this._router.navigate([
              `../../categories/${editTaskForm.controls.category.value}`,
            ])
          )
        )
        .subscribe();
    }
  }

  get currentlySelectedCategory(): string {
    return this.editTaskForm.controls.category.value;
  }

  compareCategories(a: string, b: string): boolean {
    return a === b;
  }
}
