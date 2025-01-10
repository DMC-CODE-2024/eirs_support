export interface GroupFeatureDto {
  id: {
    groupId: number;
    featureId: number;
  };
  group: {
    id: number;
    groupName: string;
    parentGroupId: number;
    description: string;
    createdOn: Date;
    updatedOn: Date;
  };
  feature: {
    id: number;
    featureName: string;
  };
  totalElements: number;
  content: GroupFeatureDto[];
  status: string;
  createdOn: Date;
  updatedOn: Date;
  displayOrder: number;
}
