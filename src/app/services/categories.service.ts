import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryModel } from '../models/category.model';
import { TaskModel } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  constructor(private _httpClient: HttpClient) {}

  getAllCategories(): Observable<CategoryModel[]> {
    return this._httpClient.get<CategoryModel[]>(
      'https://63761992b5f0e1eb850298da.mockapi.io/categories'
    );
  }

  create(
    category: Omit<CategoryModel, 'id'>
  ): Observable<Omit<CategoryModel, 'id'>> {
    return this._httpClient.post<Omit<CategoryModel, 'id'>>(
      'https://63761992b5f0e1eb850298da.mockapi.io/categories',
      category
    );
  }

  getOneById(categoryId: string): Observable<CategoryModel> {
    return this._httpClient.get<CategoryModel>(
      `https://63761992b5f0e1eb850298da.mockapi.io/categories/${categoryId}`
    );
  }

  updateById(category: CategoryModel): Observable<CategoryModel> {
    return this._httpClient.put<CategoryModel>(
      `https://63761992b5f0e1eb850298da.mockapi.io/categories/${category.id}`,
      category
    );
  }
}
