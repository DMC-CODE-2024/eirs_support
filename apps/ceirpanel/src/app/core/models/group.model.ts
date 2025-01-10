import { FeatureModel } from "./feature.model";
import { RoleModel } from "./role.model";

export interface GroupModel{
    id: number;
    groupName: string;
    parentGroupId: number;
    description: string;
    createdOn: Date;
    updatedOn: Date;
    parent: GroupModel;
    children: GroupModel[];
    roles: RoleModel[];
    features: FeatureModel[];
    status: string;
}
export interface GroupList {
    content: GroupModel[];
    totalElements: number;
}