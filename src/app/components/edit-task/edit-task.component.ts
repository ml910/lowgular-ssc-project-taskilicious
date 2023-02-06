import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
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

  readonly editTaskForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(CustomValidators.LETTERS_ONLY),
    ]),
    category: new FormControl('', Validators.required),
    teamMemberIds: new FormArray([]),
  });

  readonly task$: Observable<TaskModel> = this._activatedRoute.params.pipe(
    switchMap((params: Params) =>
      this._tasksService.getOneById(params['taskId'])
    ),
    tap((taskDetails: TaskModel) => {
      this.editTaskForm.patchValue({
        name: taskDetails.name,
        category: taskDetails.categoryId,
        teamMemberIds: taskDetails.teamMemberIds,
      });
    })
  );

  readonly availableCategories$: Observable<CategoryModel[]> =
    this._categoriesService.getAllCategories();

  readonly teamMembers$: Observable<TeamMemberModel[]> =
    this._teamMembersService.getAllTeamMembers();

  get teamMembersFormArray(): FormArray {
    return this.editTaskForm.get('teamMemberIds') as FormArray;
  }

  // TODO: Adjust
  checkIfSelected(memberId: string): boolean {
    return true;
  }

  // Same problem as when creating a task
  addMemberToArrayOrRemoveMemberFromArray(memberId: string): void {
    if (!this.teamMembersFormArray.value.includes(memberId)) {
      this.teamMembersFormArray.push(new FormControl(memberId));
    } else {
      this.teamMembersFormArray.removeAt(+memberId - 1);
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
                teamMemberIds: editTaskForm.controls.teamMemberIds.value,
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
