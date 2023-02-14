import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take, tap } from 'rxjs';
import { CustomValidators } from 'src/app/custom-validators.enum';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-create-category',
  styleUrls: ['./create-category.component.scss'],
  templateUrl: './create-category.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCategoryComponent {
  constructor(
    private _categoriesService: CategoriesService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  readonly createCategoryForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      // TODO: Normally this would be in a separate directory for re-usable validators
      Validators.pattern(CustomValidators.LETTERS_ONLY),
    ]),
  });

  onCreateCategoryFormSubmitted(form: FormGroup): void {
    if (this.createCategoryForm.valid) {
      //  ID is provided by BE, and it is a smart one - it never adds the same ID twice, even among the newly-created entities
      this._categoriesService
        .create({
          name: form.controls.name.value,
        })
        .pipe(take(1))
        .subscribe(() =>
          //  Go back to parent because that's the list - the list does not show at root
          this._router.navigate(['/'], { relativeTo: this._activatedRoute })
        );
    }
  }
}
