import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModel } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(private _httpClient: HttpClient) {}

  getAllTasks(): Observable<TaskModel[]> {
    return this._httpClient.get<TaskModel[]>(
      `https://63761992b5f0e1eb850298da.mockapi.io/tasks`
    );
  }
}
