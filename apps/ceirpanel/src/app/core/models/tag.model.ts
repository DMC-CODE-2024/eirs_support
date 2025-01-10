export interface TagModel{
    id: number;
    moduleTagName: string;
    description: string;
    createdOn: Date;
    updatedOn: Date;
    status: string;
}
export interface TagList {
    content: TagModel[];
    totalElements: number;
}
export interface TagFilterModel {
    startDate: Date;
    endDate: Date;
    moduleTagName: string;
}