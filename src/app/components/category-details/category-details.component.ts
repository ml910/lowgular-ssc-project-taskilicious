import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { CategoryModel } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

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
    private _activatedRoute: ActivatedRoute
  ) {}

  readonly categoryDetails$: Observable<CategoryModel> =
    this._activatedRoute.params.pipe(
      switchMap((params: Params) =>
        this._categoriesService.getOneById(params['categoryId'])
      )
    );
}
