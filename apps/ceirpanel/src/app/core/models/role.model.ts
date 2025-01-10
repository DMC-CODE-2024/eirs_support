/* eslint-disable @typescript-eslint/no-explicit-any */
export enum AccessEnum {
    none, self, group, all
}
export interface RoleModel{
    id: number;
    roleName: string;
    description: string;
    access: string;
    createdOn: Date;
    updatedOn: Date;
    [key: string]: any;
    status: string;
}
export interface RoleList {
    content: RoleModel[];
    totalElements: number;
}
export interface RoleFilterModel {
    startDate: Date;
    endDate: Date;
    roleName: string;
}