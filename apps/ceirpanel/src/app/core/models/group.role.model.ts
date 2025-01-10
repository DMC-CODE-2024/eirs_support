import { GroupModel } from "./group.model";
import { RoleModel } from "./role.model";

export interface GroupRoleCreateModel {
    groupId: number;
    roles: number[];
    group: GroupModel;
}
export interface GroupRoleModel{
    id: number;
    roleName: string;
    groupId: number;
    group: GroupModel;
    description: string;
    createdOn: Date;
    updatedOn: Date;
    roles: RoleModel[];
}
export interface GroupRoleList {
    content: GroupRoleModel[];
    totalElements: number;
}
export interface GroupRoleFilterModel {
    startDate: Date;
    endDate: Date;
    roleName: string;
}