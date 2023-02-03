import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
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
  constructor(private _categoriesService: CategoriesService) {}

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

  compareCategories(a: string, b: string): boolean {
    return a === b;
  }

  onCreateTaskFormSubmitted(createTaskForm: FormGroup): void {}
}
