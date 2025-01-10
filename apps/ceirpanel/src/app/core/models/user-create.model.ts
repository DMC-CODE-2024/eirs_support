
export interface Name {
    firstName: string;
    lastName: string;
}
export interface Address {
    address: string;
    country: string;
    stateName: string;
    province: string;
    district: string;
    commune: string;
    village: string;
    street: string;
    locality: string;
    postalCode: string;
}
export interface Id {
    companyName: string;
    designation: string;
    nationalId: string;
    uploadNationalId: string;
    uploadUserPhoto: string;
    employeeId: string;
    idCardFileName: string;
    natureOfEmployment: string;
}
export interface Reporting {
    authorityName: string;
    authorityEmail: string;
    authorityPhoneNo: string;
}
export interface Password {
    password: string;
    confirm: string;
}
export interface Contact {
    email: string;
    phoneNo: string;
}
export interface Security {
    question1: number;
    question2: number;
    question3: number;
    answer1: string;
    answer2: string;
    answer3: string;
}
export interface UserCreate {
    name: Name;
    address: Address;
    id: Id;
    reporting: Reporting;
    password: Password;
    contact: Contact;
    security: Security;
}