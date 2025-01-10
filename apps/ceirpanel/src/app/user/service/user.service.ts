import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable } from 'rxjs';
import { Address, Contact, Id, Name, Password, Reporting, Security, UserCreate } from '../../core/models/user-create.model';
import { UserList, UserModel } from '../../core/models/user.model';
import { ApiUtilService } from '../../core/services/common/api.util.service';
import { UploadService } from '../../core/services/common/upload.service';
import { GroupModel } from '../../core/models/group.model';
import { UserGroupCreateModel } from '../../core/models/user.group.model';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiutil: ApiUtilService, private uploadService: UploadService) {}

  public pagination( state: ClrDatagridStateInterface):Observable<UserList> {
    return this.apiutil.post('/user/pagination',state) as Observable<UserList>;
  }
  public users():Observable<Array<UserModel>> {
    return this.apiutil.get(`/user/list`) as Observable<Array<UserModel>>;
  }
  public delete(data: []): Observable<boolean>{
    return this.apiutil.post('/user/delete', data) as Observable<boolean>;
  }
  public activate(data: []): Observable<boolean>{
    return this.apiutil.post('/user/active', data) as Observable<boolean>;
  }
  public view(id: number):Observable<UserModel> {
    return this.apiutil.get(`/user/${id}`) as Observable<UserModel>;
  }
  public save(formData: FormData):Observable<UserModel>{
    return this.apiutil.postMultipart(`/user/save`, formData) as Observable<UserModel>;
  }
  public update(id:number, formData: FormData):Observable<UserModel>{
    return this.apiutil.postMultipart(`/user/update/${id}`, formData) as Observable<UserModel>;
  }
  public saveusergroup(userGroupFeature: UserGroupCreateModel):Observable<unknown>{
    return this.apiutil.post(`/userGroup/save`, userGroupFeature) as Observable<unknown>;
  }
  public updateusergroup(id:number, userGroupFeature: UserGroupCreateModel):Observable<unknown>{
    return this.apiutil.post(`/userGroup/update/${id}`, userGroupFeature) as Observable<unknown>;
  }
  public groups():Observable<Array<GroupModel>> {
    return this.apiutil.get(`/group/list`) as Observable<Array<GroupModel>>;
  }
  
  public resetpassword(ids: number[]) :Observable<Array<GroupModel>>{
    return this.apiutil.post(`/user/reset-password`, ids) as Observable<Array<GroupModel>>;
  }

  public getUserCreateObj(obj: UserModel) {
    const templateForm: UserCreate = {
      name: obj.profile as Name, address: obj.profile as Address, id: obj.profile as Id, reporting: obj.profile as Reporting,
      password: obj.profile as Password, contact: obj.profile as Contact, security: obj.profile as Security
    } as UserCreate;
    /*templateForm.security = { 
      question1: obj.questions && obj.questions.length > 0 ? obj?.questions[0]?.id?.questionId: 0, answer1: obj?.questions[0]?.answer,
      question2: obj.questions && obj.questions.length > 1 ? obj?.questions[1]?.id?.questionId: 0, answer2: obj?.questions[1]?.answer,
      question3: obj.questions && obj.questions.length > 2 ? obj?.questions[2]?.id?.questionId: 0, answer3: obj?.questions[2]?.answer
    } as Security;*/
    return templateForm;
  }
  
  public getNidCardObject(obj: UserModel){
    const nidCardObject = [];
    if(obj.profile && obj.profile.nidFileName) {
      nidCardObject.push({ image:this.uploadService.resource(obj?.profile?.nidFileName),thumbImage:this.uploadService.resource(obj?.profile?.nidFileName)});
    }
    return nidCardObject;
  }

  public getIdCardObject(obj: UserModel){
    const idCardObject = [];
    if(obj.profile && obj.profile.idCardFileName) {
      idCardObject.push({ image:this.uploadService.resource(obj?.profile?.idCardFileName) , thumbImage:this.uploadService.resource(obj?.profile?.idCardFileName) });
    }
    return idCardObject;
  }

  public getPhotoObject(obj: UserModel) {
    const photoObject = [];
    if(obj.profile && obj.profile.photoFileName) {
      photoObject.push({ image:this.uploadService.resource(obj?.profile?.photoFileName) , thumbImage:this.uploadService.resource(obj?.profile?.photoFileName) });
    }
    return photoObject;
  }
  public getDeleteDto(data: UserModel | Array<UserModel>) {
    const request:any = [];
    if(_.isArray(data))data.forEach(d => request.push(d.id));
    else request.push(data.id);
    return request;
  }
  
}
