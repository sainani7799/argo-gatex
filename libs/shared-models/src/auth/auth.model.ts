export class AuthModel {
    userName: string
    employeeId:number
    cardNo:string
    unitId:number
    unitName:string
    unitCode:string
    roleId:number
    roleName:string
    department?:number
    buyerTeam?:string

/**
 * 
 * @param userName 
 * @param employeeId 
 * @param cardNo 
 * @param unitId 
 * @param unitName 
 * @param unitCode 
 * @param roleId 
 * @param roleName 
 */

    constructor(
        userName: string,
        employeeId:number,
        cardNo:string,
        unitId:number,
        unitName:string,
        unitCode:string,
        roleId:number,
        roleName:string,
        department?:number,
        buyerTeam?:string

    ) {
        this.userName = userName;
        this.employeeId = employeeId;
        this.cardNo = cardNo;
        this.unitId = unitId;
        this.unitName = unitName;
        this.unitCode = unitCode;
        this.roleId = roleId;
        this.roleName =roleName;
        this.department = department
        this.buyerTeam = buyerTeam
    }

}