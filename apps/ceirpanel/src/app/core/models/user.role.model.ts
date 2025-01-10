import { RoleModel } from "./role.model";
import { UserModel } from "./user.model";

export interface UserRoleCreateModel {
    userId: number;
    roles: number[];
    user: UserModel;
}
export interface UserRoleModel{
    id: number;
    roleName: string;
    user: UserModel;
    description: string;
    createdOn: Date;
    updatedOn: Date;
    roles: RoleModel[];
}
export interface UserRoleList {
    content: UserRoleModel[];
    totalElements: number;
}
export interface UserRoleFilterModel {
    startDate: Date;
    endDate: Date;
    roleName: string;
}