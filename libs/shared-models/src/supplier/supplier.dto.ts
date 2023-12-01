export class SupplierDto {
    supplierName:string;
    createdUser:string;
    constructor(supplierName:string,createdUser:string){
        this.supplierName = supplierName
        this.createdUser = createdUser
    }
}