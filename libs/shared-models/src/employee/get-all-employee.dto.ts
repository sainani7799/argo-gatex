export class GetAllEmployeeDto {
    employeeId: number;
    employeeName: string;
    employeeCode: string;
    designation: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    mobileNumber: string;
    emailId: string;
    department: string;
    address: string;
    isActive: boolean;
    versionFlag: number;
    constructor(
        employeeId: number,
        employeeName: string,
        employeeCode: string,
        designation: string,
        dateOfBirth: string,
        gender: string,
        maritalStatus: string,
        mobileNumber: string,
        emailId: string,
        department: string,
        address: string,
        isActive: boolean,
        versionFlag: number,
    ) {
        this.employeeId = employeeId
        this.employeeName = employeeName;
        this.employeeCode = employeeCode;
        this.designation = designation;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.maritalStatus = maritalStatus;
        this.mobileNumber = mobileNumber;
        this.emailId = emailId;
        this.department = department;
        this.address = address;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
    }
}