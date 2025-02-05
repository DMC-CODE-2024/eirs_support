/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { FeatureModuleDto } from '../../../feature-module/dto/feature.module.dto';
import { GroupFeatureDto } from '../../../group/dto/group.feature.dto';
import { GroupRoleDto } from '../../../group/dto/group.role.dto';
import { UserGroupDto } from '../../../user-group/dto/user-group.dto';
import { UserFeatureDto } from '../../../user/dto/user.feature.dto';
import { UserRoleDto } from '../../../user/dto/user.role.dto';
import { AclModel } from '../../models/acl.model';
import { FeatureModel } from '../../models/feature.model';
import { GroupModel } from '../../models/group.model';
import { ModuleMangeModel } from '../../models/module.manage.model';
import { RoleModel } from '../../models/role.model';
import { TagModel } from '../../models/tag.model';
import { TicketModel } from '../../models/ticket.model';
import { UserModel } from '../../models/user.model';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private export(data: any [], fileName: string, options: any) {
    new ngxCsv(data, fileName, options);
  }
  public users(users: Array<UserModel>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const date = new DatePipe('en-US').transform(u?.createdOn, 'yyyy-MM-dd');
      const status = !u.currentStatus || u.currentStatus==='0' ? 'Inactive': u.currentStatus==='3' ? 'Active': u.currentStatus=='4' ? 'Suspended': u.currentStatus==='5' ? 'Locked': u.currentStatus==='21' ? 'Deleted': 'Inactive';
      data.push({created: date,firstName: u.profile.firstName, lastName: u.profile.lastName,userName:u?.userName,organization:u?.profile?.companyName,status});
    })
    this.export(data, fileName, options);
  }
  public groups(users: Array<GroupModel>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const date = new DatePipe('en-US').transform(u?.createdOn, 'yyyy-MM-dd');
      data.push({id:u?.id,created: date,groupName: u?.groupName, parentGroupName: u.parent? u.parent?.groupName: 'NA'});
    });
    this.export(data, fileName, options);
  }
  public features(users: Array<FeatureModel>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const date = new DatePipe('en-US').transform(u?.createdOn, 'yyyy-MM-dd');
      const status = !u.status || u.status==='0' ? 'Inactive': u.status==='3' ? 'Active': u.status=='4' ? 'Suspended': u.status==='5' ? 'Locked': u.status==='21' ? 'Deleted': 'Inactive';
      data.push({created: date,featureName: u?.featureName, category: u.category,status});
    });
    this.export(data, fileName, options);
  }
  public tags(users: Array<TagModel>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const status = !u.status || u.status==='0' ? 'Inactive': u.status==='3' ? 'Active': u.status=='4' ? 'Suspended': u.status==='5' ? 'Locked': u.status==='21' ? 'Deleted': 'Inactive';
      const created = new DatePipe('en-US').transform(u?.createdOn, 'yyyy-MM-dd');
      const modified = new DatePipe('en-US').transform(u?.updatedOn, 'yyyy-MM-dd');
      data.push({created: created, modifedOn: modified, featureName: u?.moduleTagName,status});
    });
    this.export(data, fileName, options);
  }
  public modules(users: Array<ModuleMangeModel>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const created = new DatePipe('en-US').transform(u?.createdOn, 'yyyy-MM-dd');
      const modified = new DatePipe('en-US').transform(u?.updatedOn, 'yyyy-MM-dd');
      const status = !u.status || u.status==='0' ? 'Inactive': u.status==='3' ? 'Active': u.status=='4' ? 'Suspended': u.status==='5' ? 'Locked': u.status==='21' ? 'Deleted': 'Inactive';
      data.push({created: created, modifiedOn: modified,moduleName: u.moduleName,status});
    });
    this.export(data, fileName, options);
  }
  public featureModules(users: Array<FeatureModuleDto>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const status = !u.status || u.status==='0' ? 'Inactive': u.status==='3' ? 'Active': u.status=='4' ? 'Suspended': u.status==='5' ? 'Locked': u.status==='21' ? 'Deleted': 'Inactive';
      const date = new DatePipe('en-US').transform(u?.createdOn, 'yyyy-MM-dd');
      data.push({created:date,feature:u?.feature?.featureName,module: u?.module?.moduleName,status});
    });
    this.export(data, fileName, options);
  }
  public groupFeatures(users: Array<GroupFeatureDto>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const status = !u.status || u.status==='0' ? 'Inactive': u.status==='3' ? 'Active': u.status=='4' ? 'Suspended': u.status==='5' ? 'Locked': u.status==='21' ? 'Deleted': 'Inactive';
      const date = new DatePipe('en-US').transform(u?.createdOn, 'yyyy-MM-dd');
      data.push({created: date,groupName: u?.group?.groupName, featureName: u?.feature?.featureName,status});
    });
    this.export(data, fileName, options);
  }
  public userFeatures(users: Array<UserFeatureDto>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const status = !u.status || u.status==='0' ? 'Inactive': u.status==='3' ? 'Active': u.status=='4' ? 'Suspended': u.status==='5' ? 'Locked': u.status==='21' ? 'Deleted': 'Inactive';
      const date = new DatePipe('en-US').transform(u?.createdOn, 'yyyy-MM-dd');
      data.push({created: date,userName: u?.user?.userName, featureName: u?.feature?.featureName,status});
    });
    this.export(data, fileName, options);
  }
  public userGroups(users: Array<UserGroupDto>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const status = !u.status || u.status==='0' ? 'Inactive': u.status==='3' ? 'Active': u.status=='4' ? 'Suspended': u.status==='5' ? 'Locked': u.status==='21' ? 'Deleted': 'Inactive';
      const date = new DatePipe('en-US').transform(u?.createdOn, 'yyyy-MM-dd');
      data.push({created: date,userName: u?.user?.userName, groupName: u?.group?.groupName,status});
    });
    this.export(data, fileName, options);
  }
  public roles(users: Array<RoleModel>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const status = !u.status || u.status==='0' ? 'Inactive': u.status==='3' ? 'Active': u.status=='4' ? 'Suspended': u.status==='5' ? 'Locked': u.status==='21' ? 'Deleted': 'Inactive';
      const date = new DatePipe('en-US').transform(u?.createdOn, 'yyyy-MM-dd');
      data.push({created: date,roleName: u.roleName, access: u.access,status});
    });
    this.export(data, fileName, options);
  }
  public userRoles(users: Array<UserRoleDto>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const status = !u.status || u.status==='0' ? 'Inactive': u.status==='3' ? 'Active': u.status=='4' ? 'Suspended': u.status==='5' ? 'Locked': u.status==='21' ? 'Deleted': 'Inactive';
      const date = new DatePipe('en-US').transform(u?.createdOn, 'yyyy-MM-dd');
      data.push({created: date,userName: u?.user.userName, role: u?.role?.roleName,status});
    });
    this.export(data, fileName, options);
  }
  public groupRoles(users: Array<GroupRoleDto>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const status = !u.status || u.status==='0' ? 'Inactive': u.status==='3' ? 'Active': u.status=='4' ? 'Suspended': u.status==='5' ? 'Locked': u.status==='21' ? 'Deleted': 'Inactive';
      const date = new DatePipe('en-US').transform(u?.createdOn, 'yyyy-MM-dd');
      data.push({created: date,groupName: u?.group?.groupName,role: u?.role?.roleName,status});
    });
    this.export(data, fileName, options);
  }
  public acl(users: Array<AclModel>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const date = new DatePipe('en-US').transform(u?.createdOn, 'yyyy-MM-dd');
      data.push({created: date,roleName: u?.role?.roleName,feature: u?.feature?.featureName, module: u?.module?.moduleName});
    });
    this.export(data, fileName, options);
  }
  public tickets(users: Array<TicketModel>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const status = u?.issue?.status?.name;
      const created = new DatePipe('en-US').transform(u?.issue.createdOn, 'yyyy-MM-dd');
      const modified = new DatePipe('en-US').transform(u?.issue?.updatedOn, 'yyyy-MM-dd');
      data.push({createdOn:created,modifedOn:modified,ticketId: u?.ticketId,subject:u?.issue?.subject,raisedBy:u?.raisedBy,status});
    });
    this.export(data, fileName, options);
  }
  public ticketsnonadmin(users: Array<TicketModel>, fileName: string, options: any) {
    const data: any[] = [] as any;
    users.forEach(u => {
      const status = u?.issue?.status?.name;
      const created = new DatePipe('en-US').transform(u?.issue.createdOn, 'yyyy-MM-dd');
      const modified = new DatePipe('en-US').transform(u?.issue?.updatedOn, 'yyyy-MM-dd');
      data.push({createdOn:created,modifedOn:modified,ticketId: u?.ticketId,mobileNumber: u?.mobileNumber,subject:u?.issue?.subject,raisedBy:u?.raisedBy === 'END_USER' ? 'End User': 'Self',status});
    });
    this.export(data, fileName, options);
  }
}
