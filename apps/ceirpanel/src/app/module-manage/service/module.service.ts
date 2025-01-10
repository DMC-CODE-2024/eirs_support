import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable } from 'rxjs';
import { ModuleMangeModel } from '../../core/models/module.manage.model';
import { UserList } from '../../core/models/user.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { UploadService } from '../../core/services/common/upload.service';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  constructor(private apiutil: ApiUtilService, private uploadService: UploadService) {}

  public pagination( state: ClrDatagridStateInterface):Observable<UserList> {
    return this.apiutil.post('/module/pagination',state) as Observable<UserList>;
  }
  public users():Observable<Array<ModuleMangeModel>> {
    return this.apiutil.get(`/module/list`) as Observable<Array<ModuleMangeModel>>;
  }
  public delete(data: []): Observable<boolean>{
    return this.apiutil.post('/module/delete', data) as Observable<boolean>;
  }
  public activate(data: []): Observable<boolean>{
    return this.apiutil.post('/module/active', data) as Observable<boolean>;
  }
  public view(id: number):Observable<ModuleMangeModel> {
    return this.apiutil.get(`/user/${id}`) as Observable<ModuleMangeModel>;
  }
  public save(formData: FormData):Observable<ModuleMangeModel>{
    return this.apiutil.postMultipart(`/user/save`, formData) as Observable<ModuleMangeModel>;
  }
  public update(id:number, formData: FormData):Observable<ModuleMangeModel>{
    return this.apiutil.postMultipart(`/user/update/${id}`, formData) as Observable<ModuleMangeModel>;
  }
  public getDeleteDto(data: ModuleMangeModel | Array<ModuleMangeModel>) {
    const request:any = [];
    if(_.isArray(data))data.forEach(d => request.push(d.id));
    else request.push(data.id);
    return request;
  }
}
