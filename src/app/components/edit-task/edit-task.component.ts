import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { concatMap, switchMap, take, tap } from 'rxjs/operators';
import { TeamMemberModel } from '../../models/team-member.model';
import { TasksService } from '../../services/tasks.service';
import { CategoriesService } from '../../services/categories.service';
import { TeamMembersService } from '../../services/team-members.service';
import { TaskModel } from '../../models/task.model';
import { CategoryModel } from '../../models/category.model';
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
    private _categoriesService: CategoriesService,
    private _teamMembersService: TeamMembersService
  ) {}

  readonly editTaskForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(CustomValidators.LETTERS_ONLY),
    ]),
    category: new FormControl('', Validators.required),
    teamMemberIds: new FormControl(new Set<string>([]), { nonNullable: true }),
  });

  readonly task$: Observable<TaskModel> = this._activatedRoute.params.pipe(
    switchMap((params: Params) =>
      this._tasksService.getOneById(params['taskId'])
    ),
    tap((taskDetails: TaskModel) => {
      this.editTaskForm.patchValue({
        name: taskDetails.name,
        category: taskDetails.categoryId,
        teamMemberIds: new Set<string>(taskDetails.teamMemberIds),
      });
    })
  );

  readonly availableCategories$: Observable<CategoryModel[]> =
    this._categoriesService.getAllCategories();

  readonly teamMembers$: Observable<TeamMemberModel[]> =
    this._teamMembersService.getAllTeamMembers();

  get teamMembersInTask(): FormControl {
    return this.editTaskForm.controls.teamMemberIds;
  }

  get currentlySelectedCategory(): string {
    if (this.editTaskForm.controls?.category?.value) {
      return this.editTaskForm.controls.category.value;
    }

    return '';
  }

  compareCategories(a: string, b: string): boolean {
    return a === b;
  }

  checkIfSelected(memberId: string): boolean {
    return !!this.teamMembersInTask.value.has(memberId);
  }

  addMemberToArrayOrRemoveMemberFromArray(memberId: string): void {
    if (!this.teamMembersInTask.value.has(memberId)) {
      const set = new Set(this.teamMembersInTask.value.add(memberId));

      this.teamMembersInTask.patchValue(set);
    } else {
      const value = this.teamMembersInTask.value;

      value.delete(memberId);
      this.teamMembersInTask.patchValue(value);
    }
  }

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
                teamMemberIds: Array.from(
                  editTaskForm.controls.teamMemberIds.value
                ),
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
}
