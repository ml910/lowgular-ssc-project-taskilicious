import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  createTask(task: Omit<TaskModel, 'id'>): Observable<TaskModel> {
    return this._httpClient.post<TaskModel>(
      'https://63761992b5f0e1eb850298da.mockapi.io/tasks',
      task
    );
  }

  removeTaskById(categoryId: string, taskId: string): Observable<void> {
    return this._httpClient.delete<void>(
      `https://63761992b5f0e1eb850298da.mockapi.io/tasks/${taskId}`
    );
  }
}
