import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { TeamMemberModel } from '../../models/team-member.model';
import { CategoriesService } from '../../services/categories.service';
import { TasksService } from '../../services/tasks.service';
import { TeamMembersService } from '../../services/team-members.service';
import { CategoryModel } from '../../models/category.model';
import { TaskModel } from '../../models/task.model';

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
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _teamMembersService: TeamMembersService
  ) {}

  readonly tasksTableColumns: string[] = [
    'Image',
    'Name',
    'Category ID',
    'Team Members',
    'Edit',
    'Remove',
  ];

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

  private _teamMembersSubject: BehaviorSubject<TeamMemberModel[]> =
    new BehaviorSubject<TeamMemberModel[]>([]);

  // TODO: Match members to tasks by teamMemberId
  readonly teamMembers$: Observable<TeamMemberModel[]> =
    this._teamMembersSubject.asObservable().pipe(
      switchMap(() => this._teamMembersService.getAllTeamMembers()),
      shareReplay(1)
    );

  // combineLatest and not SwitchMap because:
  // 1. The GET method from the service does not return tasks by categoryID (then we would have used switchMap)
  // 2. You need to get both tasks and the route data, but you do not want to do it separately
  // 3. All other array options would return TaskModel and not TaskModel[]
  readonly tasksInCategory$: Observable<
    Array<TaskModel | { memberAvatars: string[] }>
  > = combineLatest([
    // We include refresh$ here because we will use it later. We do not USE it here directly, however
    this.tasksRefresh$,
    // Here is it connected to a BE operation - and only then it actually DOES something
    this.categoryTasks$,
    this._activatedRoute.params,
    this.teamMembers$,
  ]).pipe(
    switchMap(([refresh, tasks, route, members]) => {
      return this._tasksService.getAllTasks().pipe(
        map((tasksss: TaskModel[]) => {
          const tasksInCategory: TaskModel[] = tasksss.filter(
            (task) => task.categoryId === route['categoryId']
          );

          // If the BE returned string[], it would work (category 'UI' works for example)
          const tasksWithMembersFallback: Array<
            TaskModel | { memberAvatars: string[] }
          > = tasksInCategory
            .map((filTask) => ({
              ...filTask,
              teamMemberIds: filTask.teamMemberIds ?? [],
            }))
            .map((filTask: TaskModel) => {
              console.log(filTask);

              return {
                ...filTask,
                memberAvatars: filTask.teamMemberIds
                  ?.map(
                    (id) =>
                      members.find(
                        (member: TeamMemberModel) => member.id === id
                      )?.avatar
                  )
                  .filter((avatar: string | undefined) => avatar != null),
              };
            });

          return tasksWithMembersFallback;
        })
      );
    })
  );

  editTaskById(taskId: string): void {
    this._router.navigate([taskId], { relativeTo: this._activatedRoute });
  }

  removeTaskById(categoryId: string, taskId: string): void {
    this._tasksService
      .removeTaskById(categoryId, taskId)
      // We need this refresh here - even though tasksInCategory$ has built-in refresh, it will not ACT until we call next() on it down there
      .subscribe(() => this.tasksRefreshSubject.next());
  }
}
