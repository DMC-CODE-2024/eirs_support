import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable } from 'rxjs';

import { UserList } from '../../core/models/user.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { UploadService } from '../../core/services/common/upload.service';
import * as _ from "lodash";
import { TagModel } from '../../core/models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private apiutil: ApiUtilService, private uploadService: UploadService) {}

  public pagination( state: ClrDatagridStateInterface):Observable<UserList> {
    return this.apiutil.post('/tag/pagination',state) as Observable<UserList>;
  }
  public users():Observable<Array<TagModel>> {
    return this.apiutil.get(`/tag/list`) as Observable<Array<TagModel>>;
  }
  public delete(data: []): Observable<boolean>{
    return this.apiutil.post('/tag/delete', data) as Observable<boolean>;
  }
  public activate(data: []): Observable<boolean>{
    return this.apiutil.post('/tag/active', data) as Observable<boolean>;
  }
  public view(id: number):Observable<TagModel> {
    return this.apiutil.get(`/tag/${id}`) as Observable<TagModel>;
  }
  public save(formData: FormData):Observable<TagModel>{
    return this.apiutil.postMultipart(`/tag/save`, formData) as Observable<TagModel>;
  }
  public update(id:number, formData: FormData):Observable<TagModel>{
    return this.apiutil.postMultipart(`/tag/update/${id}`, formData) as Observable<TagModel>;
  }
  public getDeleteDto(data: TagModel | Array<TagModel>) {
    const request:any = [];
    if(_.isArray(data))data.forEach(d => request.push(d.id));
    else request.push(data.id);
    return request;
  }
}
