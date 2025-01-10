import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import * as _ from "lodash";
import { Observable } from 'rxjs';
import { UserModel } from '../../core/models/user.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { GroupFeatureDto } from '../dto/group.feature.dto';

@Injectable({
  providedIn: 'root',
})
export class GroupFeatureService {
  constructor(private apiutil: ApiUtilService) {}
  public pagination(state: ClrDatagridStateInterface): Observable<GroupFeatureDto> {
    return this.apiutil.post('/groupFeature/pagination', state) as Observable<GroupFeatureDto>;
  }
  public delete(data: []): Observable<boolean>{
    return this.apiutil.post('/groupFeature/delete', data) as Observable<boolean>;
  }
  public activate(data: []): Observable<boolean>{
    return this.apiutil.post('/groupFeature/active', data) as Observable<boolean>;
  }
  public findByGroupId(groupId: number): Observable<Array<GroupFeatureDto>>{
    return this.apiutil.get(`/groupFeature/${groupId}`) as Observable<Array<GroupFeatureDto>>;
  }
  public getDeleteDto(data: GroupFeatureDto | Array<GroupFeatureDto>) {
    const request:any = [];
    if(_.isArray(data))data.forEach(d => request.push(d.id));
    else request.push(Object.assign(data.id));
    return request;
  }
  public view(id: number):Observable<UserModel> {
    return this.apiutil.get(`/groupFeature/${id}`) as Observable<UserModel>;
  }
}
