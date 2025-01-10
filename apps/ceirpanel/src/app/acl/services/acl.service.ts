import { Injectable } from '@angular/core';
import * as _ from "lodash";
import { AclModel } from '../../core/models/acl.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { UploadService } from '../../core/services/common/upload.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AclService {
  constructor(private apiutil: ApiUtilService, private uploadService: UploadService) {}

  public delete(data: []): Observable<boolean>{
    return this.apiutil.post('/acl/delete', data) as Observable<boolean>;
  }
  public getDeleteDto(data: AclModel | Array<AclModel>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request:any = [];
    if(_.isArray(data))data.forEach(d => request.push(d.id));
    else request.push(data.id);
    return request;
  }
  public activate(data: []): Observable<boolean>{
    return this.apiutil.post('/acl/active', data) as Observable<boolean>;
  }
}
