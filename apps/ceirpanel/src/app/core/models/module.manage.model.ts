import { TagModel } from "./tag.model";

export interface ModuleMangeModel{
    id: number;
    moduleName: string;
    moduleTagName: string;
    moduleTag: TagModel;
    moduleTagId: number;
    description: string;
    createdOn: Date;
    updatedOn: Date;
    status: string;
    selected: boolean;
    moduleId: number;
}
export interface ModuleMangeList {
    content: ModuleMangeModel[];
    totalElements: number;
}
export interface ModuleMangeFilterModel {
    startDate: Date;
    endDate: Date;
    moduleName: string;
}