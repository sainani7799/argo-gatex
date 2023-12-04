export class CreateWarehouseDto {
    warehouseName: string;
    unitId: number;
    createdUser: string;
    constructor(warehouseName: string, unitId: number, createdUser: string) {
        this.warehouseName = warehouseName;
        this.unitId = unitId;
        this.createdUser = createdUser;
    }
}