import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable } from 'rxjs';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { UserGroupDto } from '../../user-group/dto/user-group.dto';
import * as _ from "lodash";
import { UserModel } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserGroupService {
  constructor(private apiutil: ApiUtilService) {}
  public pagination(state: ClrDatagridStateInterface): Observable<UserGroupDto> {
    return this.apiutil.post('/userGroup/pagination', state) as Observable<UserGroupDto>;
  }
  public findByUserId(userId: number): Observable<Array<UserGroupDto>>{
    return this.apiutil.get(`/userGroup/${userId}`) as Observable<Array<UserGroupDto>>;
  }
  public findByUserIds(userIds:Array<number>): Observable<Array<UserGroupDto>>{
    return this.apiutil.post(`/userGroup/findByUserIds`, userIds) as Observable<Array<UserGroupDto>>;
  }
  public delete(data: []): Observable<boolean>{
    return this.apiutil.post('/userGroup/delete', data) as Observable<boolean>;
  }
  public activate(data: []): Observable<boolean>{
    return this.apiutil.post('/userGroup/active', data) as Observable<boolean>;
  }
  public getDeleteDto(data: UserGroupDto | Array<UserGroupDto>) {
    const request:any = [];
    if(_.isArray(data))data.forEach(d => request.push(d.id));
    else request.push(Object.assign(data.id));
    return request;
  }
  public view(id: number):Observable<UserModel> {
    return this.apiutil.get(`/userGroup/${id}`) as Observable<UserModel>;
  }
}
