import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { CategoriesService } from '../../services/categories.service';
import { CategoryModel } from '../../models/category.model';

@Component({
  selector: 'app-edit-category',
  styleUrls: ['./edit-category.component.scss'],
  templateUrl: './edit-category.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCategoryComponent {
  constructor(
    private _categoriesService: CategoriesService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  readonly categoryEditForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  readonly category$: Observable<CategoryModel> =
    this._activatedRoute.params.pipe(
      switchMap((params) =>
        this._categoriesService.getOneById(params['categoryId'])
      ),
      tap((details: CategoryModel) => {
        this.categoryEditForm.patchValue({
          name: details.name,
        });
      })
    );

  onCategoryEditFormSubmitted(categoryEditForm: FormGroup): void {
    if (categoryEditForm.valid) {
      this._activatedRoute.params
        .pipe(
          switchMap((params: Params) =>
            this._categoriesService.updateById({
              ...categoryEditForm.value,
              id: params['categoryId'],
            })
          ),
          take(1)
        )
        .subscribe(() =>
          this._router.navigate(['../..'], { relativeTo: this._activatedRoute })
        );
    }
  }
}
