export class SupplierDto {
    supplierId:number;
    supplierName:string;
    supplierCode:string
    createdUser:string;
    updatedUser?:string;
    isActive?:boolean;
    constructor(supplierId:number,supplierName:string,supplierCode:string,createdUser:string,updatedUser?:string,isActive?:boolean,){
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.supplierCode = supplierCode;
        this.createdUser = createdUser;
        this.updatedUser = updatedUser;
        this.isActive = isActive

    }
}