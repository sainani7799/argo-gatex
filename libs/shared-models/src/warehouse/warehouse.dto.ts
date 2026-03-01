export class CreateWarehouseDto {
    warehouseId:number;
    warehouseName: string;
    unitId: number;
    createdUser: string;
    updatedUser?:string;
    isActive?:boolean;
    constructor(warehouseId:number,warehouseName: string, unitId: number, createdUser: string,updatedUser?:string,isActive?:boolean) {
        this.warehouseId =warehouseId;
        this.warehouseName = warehouseName;
        this.unitId = unitId;
        this.createdUser = createdUser;
        this.updatedUser = updatedUser;
        this.isActive = isActive;
    }
}