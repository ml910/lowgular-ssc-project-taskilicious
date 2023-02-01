import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { CategoryModel } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  styleUrls: ['./categories.component.scss'],
  templateUrl: './categories.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  constructor(
    private _categoriesService: CategoriesService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  readonly categories$: Observable<CategoryModel[]> = this._categoriesService
    .getAllCategories()
    .pipe(
      tap((categories) => {
        this.sortForm.controls.sortBy.valueChanges
          .pipe(
            map((value) =>
              value === 'A-Z'
                ? categories.sort((a, b) => a.name.localeCompare(b.name))
                : categories.sort((a, b) => b.name.localeCompare(a.name))
            )
          )
          .subscribe();
      })
    );

  readonly sortOptions: string[] = ['A-Z', 'Z-A'];

  readonly sortForm = new FormGroup({ sortBy: new FormControl() });

  redirectToDetails(categoryId: string): void {
    this._router.navigate([`${categoryId}`], {
      relativeTo: this._activatedRoute,
    });
  }

  redirectToEdit(categoryId: string): void {
    this._router.navigate([`edit/${categoryId}`], {
      relativeTo: this._activatedRoute,
    });
  }
}
