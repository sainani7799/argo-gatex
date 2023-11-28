
export class CreateUserDto {
    userId: Number;
    userName: string;
    password: string;
    employeeId : Number;
    cardNo:string;
    unitId:number;
    /**
     * 
     * @param userId 
     * @param userName 
     * @param password 
     * @param employeeId 
     * @param cardNo 
     * @param unitId 
     */


    constructor(userId: Number,userName: string,password: string,employeeId:Number,cardNo:string,
        unitId:number){
        this.userId = userId;
        this.userName = userName;
        this.password = password;
        this.employeeId = employeeId;
        this.cardNo = cardNo;
        this.unitId = unitId;
    }
}