
export class CreateUserDto {
    userId: Number;
    userName: string;
    password: string;
    employeeId: Number;
    cardNo: string;
    unitId: number;
    roleId : string;
    buyer : string
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


    constructor(userId: Number, 
        userName: string, 
        password: string, 
        employeeId: Number, 
        cardNo: string,
        unitId: number, 
        roleId : string , 
        buyer : string ,
        isActive?: boolean , 
    ) {
        this.userId = userId;
        this.userName = userName;
        this.password = password;
        this.employeeId = employeeId;
        this.cardNo = cardNo;
        this.unitId = unitId;
        this.roleId = roleId
        this.buyer = buyer
        this.isActive = isActive;
    }
}