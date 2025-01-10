export interface GroupRoleDto {
  id: {
    groupId: number;
    roleId: number;
  };
  group: {
    id: number;
    groupName: string;
    parentGroupId: number;
    description: string;
    createdOn: Date;
    updatedOn: Date;
  };
  role: {
    id: number;
    roleName: string;
  };
  totalElements: number;
  content: GroupRoleDto[];
  status: string;
  createdOn: Date;
  updatedOn: Date;
}
