export class SupplierDto {
    supplierName:string;
    supplierCode:string
    createdUser:string;
    constructor(supplierName:string,supplierCode:string,createdUser:string){
        this.supplierName = supplierName;
        this.supplierCode = supplierCode;
        this.createdUser = createdUser;
    }
}