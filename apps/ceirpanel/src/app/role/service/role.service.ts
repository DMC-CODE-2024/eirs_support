import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable } from 'rxjs';

import { UserList } from '../../core/models/user.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { UploadService } from '../../core/services/common/upload.service';
import * as _ from "lodash";
import { RoleModel } from '../../core/models/role.model';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private apiutil: ApiUtilService, private uploadService: UploadService) {}

  public pagination( state: ClrDatagridStateInterface):Observable<UserList> {
    return this.apiutil.post('/role/pagination',state) as Observable<UserList>;
  }
  public users():Observable<Array<RoleModel>> {
    return this.apiutil.get(`/role/list`) as Observable<Array<RoleModel>>;
  }
  public delete(data: []): Observable<boolean>{
    return this.apiutil.post('/role/delete', data) as Observable<boolean>;
  }
  public activate(data: []): Observable<boolean>{
    return this.apiutil.post('/role/active', data) as Observable<boolean>;
  }
  public view(id: number):Observable<RoleModel> {
    return this.apiutil.get(`/role/${id}`) as Observable<RoleModel>;
  }
  public save(formData: FormData):Observable<RoleModel>{
    return this.apiutil.postMultipart(`/role/save`, formData) as Observable<RoleModel>;
  }
  public update(id:number, formData: FormData):Observable<RoleModel>{
    return this.apiutil.postMultipart(`/role/update/${id}`, formData) as Observable<RoleModel>;
  }
  public getDeleteDto(data: RoleModel | Array<RoleModel>) {
    const request:any = [];
    if(_.isArray(data))data.forEach(d => request.push(d.id));
    else request.push(data.id);
    return request;
  }
}
