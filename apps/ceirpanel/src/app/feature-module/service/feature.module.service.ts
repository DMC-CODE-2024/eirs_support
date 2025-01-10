import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import * as _ from "lodash";
import { Observable } from 'rxjs';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { FeatureModuleDto } from '../dto/feature.module.dto';


@Injectable({
  providedIn: 'root',
})
export class FeatureModuleService {
  constructor(private apiutil: ApiUtilService) {}
  public pagination(state: ClrDatagridStateInterface): Observable<FeatureModuleDto> {
    return this.apiutil.post('/featureModule/pagination', state) as Observable<FeatureModuleDto>;
  }
  public delete(data: []): Observable<boolean>{
    return this.apiutil.post('/featureModule/delete', data) as Observable<boolean>;
  }
  public activate(data: []): Observable<boolean>{
    return this.apiutil.post('/featureModule/active', data) as Observable<boolean>;
  }
  public getDeleteDto(data: FeatureModuleDto | Array<FeatureModuleDto>) {
    const request:any = [];
    if(_.isArray(data))data.forEach(d => request.push(d.id));
    else request.push(Object.assign(data.id));
    return request;
  }
  public findByFeatureId(featureId: number): Observable<Array<FeatureModuleDto>>{
    return this.apiutil.get(`/featureModule/${featureId}`) as Observable<Array<FeatureModuleDto>>;
  }
  public list(): Observable<Array<FeatureModuleDto>>{
    return this.apiutil.get(`/featureModule/list`) as Observable<Array<FeatureModuleDto>>;
  }
}
