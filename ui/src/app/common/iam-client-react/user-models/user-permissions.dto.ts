import { MenusData } from "./menusData.dto";

export class UserPermissionsDto {
    userId: string;
    userName: string;
    roleId: string[];
    roleName: string[];
    menusData: MenusData[];
    externalRefNo:string;
    unitId?:number
    unit?:string

    constructor(userId: string, userName: string, roleId: string[], roleName: string[], menusData: MenusData[],externalRefNo:string,unitId?:number,unit?:string) {
        this.userId = userId;
        this.userName = userName
        this.roleId = roleId
        this.roleName = roleName
        this.menusData = menusData
        this.externalRefNo = externalRefNo
        this.unitId = unitId
        this.unit= unit
    }
}