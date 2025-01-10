import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import * as _ from "lodash";
import { Observable } from 'rxjs';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { UserRoleDto } from '../dto/user.role.dto';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  constructor(private apiutil: ApiUtilService) {}
  public pagination(state: ClrDatagridStateInterface): Observable<UserRoleDto> {
    return this.apiutil.post('/userRole/pagination', state) as Observable<UserRoleDto>;
  }
  public delete(data: []): Observable<boolean>{
    return this.apiutil.post('/userRole/delete', data) as Observable<boolean>;
  }
  public activate(data: []): Observable<boolean>{
    return this.apiutil.post('/userRole/active', data) as Observable<boolean>;
  }
  public getDeleteDto(data: UserRoleDto | Array<UserRoleDto>) {
    const request:any = [];
    if(_.isArray(data))data.forEach(d => request.push(d.id));
    else request.push(Object.assign(data.id));
    return request;
  }
  public view(userId: number): Observable<Array<UserRoleDto>>{
    return this.apiutil.get(`/userRole/${userId}`) as Observable<Array<UserRoleDto>>;
  }
}
