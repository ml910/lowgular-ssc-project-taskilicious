import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryModel } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

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

  readonly categories$: Observable<CategoryModel[]> =
    this._categoriesService.getAllCategories();

  redirectToCreate(): void {
    this._router.navigate(['create'], { relativeTo: this._activatedRoute });
  }
}
