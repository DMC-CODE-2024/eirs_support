/* eslint-disable @typescript-eslint/no-explicit-any */

export interface TicketModel{
    ticketId: string;
    userId: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    alternateMobileNumber: string;
    category: any;
    categoryId: number;
    categoryName: string;
    emailAddress: string;
    subject: string;
    description: string;
    userType: string;
    currentStatus: boolean;
    createdOn: Date;
    updatedOn: Date;
    raisedBy: string;
    resolved: boolean;
    issue: TicketIssueModel;
    captcha: string;
    referenceId: string;
    transactionId: string;
    isPrivate: boolean;
    countryCode: string;
    address: string;
    province: string;
    district: string;
    commune: string;
    documentType: string;
    fileWithDocuments: any;
}
export interface FileWithDocuments {
    key: string;
}
export interface TicketList {
    content: TicketModel[];
    totalElements: number;
}
export interface TicketIssueModel {
    subject: string;
    description: string;
    createdOn: string;
    updatedOn: string;
    journals: Array<TickerJournalModel>;
    status: TicketStatusModel;
    uploads: Array<AttachmentsModel>;
}
export interface TickerJournalModel {
    id: string;
    notes: string;
	createdOn: string;
	user: TicketUserModel;
    privateNotes: boolean;
    details: Array<AttachmentsModel>;
}
export interface AttachmentsModel {
    id: string;
    filename: string;
    filesize: number;
    contentType: string;
    contentUrl: string;
    description: string;
    name: string;
}
export interface TicketAttachment {
    property: string;
    name: string;
    newValue: string;
}
export interface TicketUserModel {
    id: string;
    name: string;
}
export interface TicketStatusModel {
    id: string;
    name: string;
    closed: boolean;
}
export interface TicketNoteDto {
    ticketId: string;
    notes: string;
    visibility: string;
}
export interface TicketFeedbackDto {
    ticketId: string;
    feedback: string;
    ratings: number;
}