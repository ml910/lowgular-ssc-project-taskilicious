import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, concatMap } from 'rxjs';
import { take } from 'rxjs/operators';
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
    // TODO: Move the letter-only validator pattern to a separate directory
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(CustomValidators.LETTERS_ONLY),
    ]),
    category: new FormControl('', [Validators.required]),
    // teamMemberIds: new FormArray([]),
  });

  readonly categories$: Observable<CategoryModel[]> =
    this._categoriesService.getAllCategories();

  readonly teamMembers$: Observable<TeamMemberModel[]> =
    this._teamMembersService.getAllTeamMembers();

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
          // teamMemberIds: createTaskForm.controls?.teamMemberIds?.value,
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
