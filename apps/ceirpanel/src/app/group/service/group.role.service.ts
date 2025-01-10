import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import * as _ from "lodash";
import { Observable } from 'rxjs';
import { UserModel } from '../../core/models/user.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { GroupRoleDto } from '../dto/group.role.dto';

@Injectable({
  providedIn: 'root',
})
export class GroupRoleService {
  constructor(private apiutil: ApiUtilService) {}
  public pagination(state: ClrDatagridStateInterface): Observable<GroupRoleDto> {
    return this.apiutil.post('/groupRole/pagination', state) as Observable<GroupRoleDto>;
  }
  public delete(data: []): Observable<boolean>{
    return this.apiutil.post('/groupRole/delete', data) as Observable<boolean>;
  }
  public activate(data: []): Observable<boolean>{
    return this.apiutil.post('/groupRole/active', data) as Observable<boolean>;
  }
  public findByGroupId(groupId: number): Observable<Array<GroupRoleDto>>{
    return this.apiutil.get(`/groupRole/${groupId}`) as Observable<Array<GroupRoleDto>>;
  }
  public getDeleteDto(data: GroupRoleDto | Array<GroupRoleDto>) {
    const request:any = [];
    if(_.isArray(data))data.forEach(d => request.push(d.id));
    else request.push(Object.assign(data.id));
    return request;
  }
  public view(id: number):Observable<UserModel> {
    return this.apiutil.get(`/groupRole/${id}`) as Observable<UserModel>;
  }
}
