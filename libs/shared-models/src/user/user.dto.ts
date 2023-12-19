
export class CreateUserDto {
    userId: Number;
    userName: string;
    password: string;
    employeeId: Number;
    cardNo: string;
    unitId: number;
    isActive?: boolean;
    
   /**
    * 
    * @param userId 
    * @param userName 
    * @param password 
    * @param employeeId 
    * @param cardNo 
    * @param unitId 
    * @param isActive 
    */


    constructor(userId: Number, userName: string, password: string, employeeId: Number, cardNo: string,
        unitId: number, isActive?: boolean) {
        this.userId = userId;
        this.userName = userName;
        this.password = password;
        this.employeeId = employeeId;
        this.cardNo = cardNo;
        this.unitId = unitId;
        this.isActive = isActive;
    }
}