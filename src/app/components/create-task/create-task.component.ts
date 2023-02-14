import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, concatMap } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TeamMemberModel } from '../../models/team-member.model';
import { CategoriesService } from '../../services/categories.service';
import { TasksService } from '../../services/tasks.service';
import { TeamMembersService } from '../../services/team-members.service';
import { CategoryModel } from '../../models/category.model';
import { CustomValidators } from 'src/app/custom-validators.enum';

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
    private _router: Router,
    private _teamMembersService: TeamMembersService
  ) {}

  readonly createTaskForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(CustomValidators.LETTERS_ONLY),
    ]),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    // Could be FormRecord
    teamMemberIds: new FormControl(new Set<string>([]), { nonNullable: true }),
  });

  readonly categories$: Observable<CategoryModel[]> =
    this._categoriesService.getAllCategories();

  readonly teamMembers$: Observable<TeamMemberModel[]> =
    this._teamMembersService.getAllTeamMembers();

  get currentlySelectedCategory(): string {
    return this.createTaskForm.controls.category.value;
  }

  get teamMembersControl(): FormControl<Set<string>> {
    return this.createTaskForm.controls.teamMemberIds;
  }

  addMemberToArrayOrRemoveMemberFromArray(memberId: string): void {
    if (!this.teamMembersControl.value.has(memberId)) {
      const set = new Set(this.teamMembersControl.value).add(memberId);

      this.teamMembersControl.patchValue(set);
    } else {
      const value = this.teamMembersControl.value;

      // Deletes in place
      value.delete(memberId);
      this.teamMembersControl.patchValue(value);
    }
  }

  compareCategories(a: string, b: CategoryModel): boolean {
    return a === b.id;
  }

  onCreateTaskFormSubmitted(createTaskForm: FormGroup): void {
    if (createTaskForm.valid) {
      this._tasksService
        .createTask({
          name: createTaskForm.controls.name.value,
          categoryId: createTaskForm.controls.category.value,
          teamMemberIds: createTaskForm.controls.teamMemberIds.value,
        })
        .pipe(
          take(1),
          concatMap((form) =>
            this._router.navigate([`categories/${form.categoryId}`])
          ),
          tap(() => console.log(createTaskForm))
        )
        .subscribe();
    }
  }
}
