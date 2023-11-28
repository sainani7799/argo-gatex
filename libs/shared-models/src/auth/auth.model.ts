export class AuthModel {
    userName: string
    employeeId:number
    cardNo:string
    unitId:number
    unitName:string
    unitCode:string

/**
 * 
 * @param userName 
 * @param employeeId 
 * @param cardNo 
 * @param unitId 
 * @param unitName 
 * @param unitCode 
 */

    constructor(
        userName: string,
        employeeId:number,
        cardNo:string,
        unitId:number,
        unitName:string,
        unitCode:string
    ) {
        this.userName = userName;
        this.employeeId = employeeId;
        this.cardNo = cardNo;
        this.unitId = unitId;
        this.unitName = unitName;
        this.unitCode = unitCode
    }

}