import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
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

  readonly tasksTableColumns: string[] = ['Name', 'Category ID', 'Remove'];

  readonly categoryDetails$: Observable<CategoryModel> =
    this._activatedRoute.params.pipe(
      switchMap((params: Params) =>
        this._categoriesService.getOneById(params['categoryId'])
      )
    );

  private _categoryTasksSubject: BehaviorSubject<TaskModel[]> =
    new BehaviorSubject<TaskModel[]>([]);

  // This is to make sure that we do not load the tasks twice
  // If it were a service call here, we would call getAll() twice when loading the initial list
  // Notice that it does not do literally anything, unless it is connected to a BE operation.
  readonly categoryTasks$: Observable<TaskModel[]> =
    this._categoryTasksSubject.asObservable();

  private tasksRefreshSubject: BehaviorSubject<void> =
    new BehaviorSubject<void>(void 0);

  public tasksRefresh$: Observable<void> =
    this.tasksRefreshSubject.asObservable();

  // combineLatest and not SwitchMap because:
  // 1. The GET method from the service does not return tasks by categoryID (then we would have used switchMap)
  // 2. You need to get both tasks and the route data, but you do not want to do it separately
  // 3. All other array options would return TaskModel and not TaskModel[]
  readonly tasksInCategory$: Observable<TaskModel[]> = combineLatest([
    // We include refresh$ here because we will use it later. We do not USE it here directly, however
    this.tasksRefresh$,
    // Here is it connected to a BE operation - and only then it actually DOES something
    this.categoryTasks$,
    this._activatedRoute.params,
  ]).pipe(
    switchMap(([refresh, tasks, route]) =>
      this._tasksService
        .getAllTasks()
        .pipe(
          map((tasks) =>
            tasks.filter((task) => task.categoryId === route['categoryId'])
          )
        )
    )
  );

  removeTaskById(categoryId: string, taskId: string): void {
    this._tasksService
      .removeTaskById(categoryId, taskId)
      // We need this refresh here - even though tasksInCategory$ has built-in refresh, it will not ACT until we call next() on it down there
      .subscribe(() => this.tasksRefreshSubject.next());
  }
}
