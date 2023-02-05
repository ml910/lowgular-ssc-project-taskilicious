import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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

  readonly createTaskForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      // Validators.pattern(CustomValidators.LETTERS_ONLY),
    ]),
    category: new FormControl('', [Validators.required]),
    teamMemberIds: new FormArray([]),
  });

  readonly categories$: Observable<CategoryModel[]> =
    this._categoriesService.getAllCategories();

  readonly teamMembers$: Observable<TeamMemberModel[]> =
    this._teamMembersService.getAllTeamMembers();

  get currentlySelectedCategory(): string {
    return this.createTaskForm.controls.category.value;
  }

  get teamMembersFormArray(): FormArray {
    return this.createTaskForm.get('teamMemberIds') as FormArray;
  }

  addMemberToArrayOrRemoveMemberFromArray(memberId: string): void {
    if (!this.teamMembersFormArray.value.includes(memberId)) {
      this.teamMembersFormArray.push(new FormControl(memberId));

      console.log('ID added: ', memberId);
    } else {
      this.removeAtIndex(+memberId);
    }

    console.log(
      'Team Members control value: ',
      this.createTaskForm.controls?.teamMemberIds?.value
    );
    console.log(
      'length: ',
      this.createTaskForm.controls?.teamMemberIds?.value.length
    );
    console.log(
      'All team members controls inside the form: ',
      this.createTaskForm.controls.teamMemberIds
    );
  }

  // TODO: Come back to it when there is free time left - already spent far too much time on this one
  removeAtIndex(memberId: number): void {
    this.teamMembersFormArray.controls.findIndex((control) => {
      // Works fine when clicking in order, does not when clicking randomly
      this.teamMembersFormArray.removeAt(memberId - 1);
    });
    console.log('removed member ID: ', memberId);
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
