import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable } from 'rxjs';
import { FeatureModel } from '../../core/models/feature.model';
import { UserList, UserModel } from '../../core/models/user.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { UploadService } from '../../core/services/common/upload.service';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  constructor(private apiutil: ApiUtilService, private uploadService: UploadService) {}

  public pagination( state: ClrDatagridStateInterface):Observable<UserList> {
    return this.apiutil.post('/feature/pagination',state) as Observable<UserList>;
  }
  public delete(data: []): Observable<boolean>{
    return this.apiutil.post('/feature/delete', data) as Observable<boolean>;
  }
  public activate(data: []): Observable<boolean>{
    return this.apiutil.post('/feature/active', data) as Observable<boolean>;
  }
  public view(id: number):Observable<FeatureModel> {
    return this.apiutil.get(`/feature/${id}`) as Observable<FeatureModel>;
  }
  public save(formData: FormData):Observable<UserModel>{
    return this.apiutil.postMultipart(`/feature/save`, formData) as Observable<UserModel>;
  }
  public update(id:number, formData: FormData):Observable<UserModel>{
    return this.apiutil.postMultipart(`/feature/update/${id}`, formData) as Observable<UserModel>;
  }
  public getDeleteDto(data: FeatureModel | Array<FeatureModel>) {
    const request:any = [];
    if(_.isArray(data))data.forEach(d => request.push(d.id));
    else request.push(data.id);
    return request;
  }
}
