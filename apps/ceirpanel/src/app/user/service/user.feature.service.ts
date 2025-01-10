import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import * as _ from "lodash";
import { Observable } from 'rxjs';
import { UserModel } from '../../core/models/user.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { UserFeatureDto } from '../dto/user.feature.dto';

@Injectable({
  providedIn: 'root',
})
export class UserFeatureService {
  constructor(private apiutil: ApiUtilService) {}
  public pagination(state: ClrDatagridStateInterface): Observable<UserFeatureDto> {
    return this.apiutil.post('/userFeature/pagination', state) as Observable<UserFeatureDto>;
  }
  public delete(data: []): Observable<boolean>{
    return this.apiutil.post('/userFeature/delete', data) as Observable<boolean>;
  }
  public activate(data: []): Observable<boolean>{
    return this.apiutil.post('/userFeature/active', data) as Observable<boolean>;
  }
  public findByUserId(userId: number): Observable<Array<UserFeatureDto>>{
    return this.apiutil.get(`/userFeature/${userId}`) as Observable<Array<UserFeatureDto>>;
  }
  public getDeleteDto(data: UserFeatureDto | Array<UserFeatureDto>) {
    const request:any = [];
    if(_.isArray(data))data.forEach(d => request.push(d.id));
    else request.push(Object.assign(data.id));
    return request;
  }
  public view(id: number):Observable<UserModel> {
    return this.apiutil.get(`/userFeature/${id}`) as Observable<UserModel>;
  }
}
