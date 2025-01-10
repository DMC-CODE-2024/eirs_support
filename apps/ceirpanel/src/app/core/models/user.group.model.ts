import { GroupModel } from "./group.model";
import { UserModel } from "./user.model";

export interface UserGroupCreateModel {
    userId: number;
    groups: number[];
    groupmap: UserGroupDto[];
    user: UserModel;
}
export interface UserGroupDto {
    groupId: number;
    displayOrder: number;
}
export interface UserGroupModel{
    id: number;
    roleName: string;
    user: UserModel;
    description: string;
    createdOn: Date;
    updatedOn: Date;
    groups: GroupModel[];
}
export interface UserGroupList {
    content: UserGroupModel[];
    totalElements: number;
}
export interface UserGroupFilterModel {
    startDate: Date;
    endDate: Date;
    userName: string;
}