export class CreateEmployeeDto {
    employeeId: number;
    employeeName: string;
    employeeCode: string;
    cardNo:string;
    designation: number;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    mobileNumber: string;
    emailId: string;
    department: number;
    section:number;
    unit: string;
    address: string;
    versionFlag: number;
    isActive : boolean;
    constructor(
        employeeId: number,
        employeeName: string,
        employeeCode: string,
        cardNo:string,
        designation: number,
        dateOfBirth: string,
        gender: string,
        maritalStatus: string,
        mobileNumber: string,
        emailId: string,
        department: number,
        unit: string,
        address: string,
        versionFlag: number,
        isActive : boolean
    ) {
        this.employeeId = employeeId
        this.employeeName = employeeName;
        this.employeeCode = employeeCode;
        this.cardNo = cardNo;
        this.designation = designation;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.maritalStatus = maritalStatus;
        this.mobileNumber = mobileNumber;
        this.emailId = emailId;
        this.department = department;
        this.unit = unit;
        this.address = address
        this.versionFlag = versionFlag;
        this.isActive = isActive;
    }
}