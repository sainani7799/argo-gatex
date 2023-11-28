

export class EmployeeRequestDto{
    employeeId: number;
    updatedUser: string;
    versionFlag: number;
    isActive: boolean;

    /**
     * 
     * @param employeeId 
     * @param updatedUser 
     * @param versionFlag 
     * @param isActive 
     */

    constructor(employeeId: number,updatedUser: string,versionFlag: number,isActive: boolean){
        this.employeeId = employeeId;
        this.updatedUser = updatedUser;
        this.versionFlag = versionFlag;
        this.isActive = isActive;

    }
}