import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeamMemberModel } from '../models/team-member.model';

@Injectable({ providedIn: 'root' })
export class TeamMembersService {
  constructor(private _httpClient: HttpClient) {}

  getAllTeamMembers(): Observable<TeamMemberModel[]> {
    return this._httpClient.get<TeamMemberModel[]>(
      'https://63761992b5f0e1eb850298da.mockapi.io/team-members'
    );
  }
}
