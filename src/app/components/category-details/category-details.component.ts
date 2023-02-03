import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest, filter, map, Observable, switchMap } from 'rxjs';
import { TaskModel } from 'src/app/models/task.model';
import { TasksService } from 'src/app/services/tasks.service';
import { CategoryModel } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-category-details',
  styleUrls: ['./category-details.component.scss'],
  templateUrl: './category-details.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDetailsComponent {
  constructor(
    private _categoriesService: CategoriesService,
    private _tasksService: TasksService,
    private _activatedRoute: ActivatedRoute
  ) {}

  readonly tasksTableColumns: string[] = ['Name', 'Category ID'];

  readonly categoryDetails$: Observable<CategoryModel> =
    this._activatedRoute.params.pipe(
      switchMap((params: Params) =>
        this._categoriesService.getOneById(params['categoryId'])
      )
    );

  readonly categoryTasks$: Observable<TaskModel[]> =
    this._tasksService.getAllTasks();

  // combineLatest and not SwitchMap because:
  // 1. The GET method from the service does not return tasks by categoryID (then we would have used switchMap)
  // 2. You need to get both tasks and the route data, but you do not want to do it separately
  // 3. All other array options would return TaskModel and not TaskModel[]
  readonly tasksInCategory$: Observable<TaskModel[]> = combineLatest([
    this.categoryTasks$,
    this._activatedRoute.params,
  ]).pipe(
    map(([tasks, route]) => {
      return tasks.filter((task) => task.categoryId === route['categoryId']);
    })
  );
}
