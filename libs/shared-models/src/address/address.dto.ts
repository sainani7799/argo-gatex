export class CreateAddressDto {
    addressId: number;
    addresser: string;
    addresserNameId:number;
    gstNo:string;
    cstNo:string;
    lineOne:string;
    lineTwo:string;
    city:string;
    dist:string;
    pinCode:number;
    state:string;
    country:string;
    createdUser: string;
    updatedUser :string;
    addresserName?:number;
    isActive?:boolean;
    constructor(addressId: number,addresser: string,addresserNameId:number,gstNo:string,cstNo:string,lineOne:string,lineTwo:string,city:string,dist:string,pinCode:number,state:string,country:string,createdUser: string,updatedUser :string,addresserName:number,isActive?:boolean){
        this.addressId = addressId;
        this.addresser = addresser;
        this.addresserNameId = addresserNameId;
        this.gstNo = gstNo;
        this.cstNo = cstNo;
        this.lineOne = lineOne;
        this.lineTwo = lineTwo;
        this.city = city;
        this.dist = dist;
        this.pinCode = pinCode;
        this.state = state;
        this.country = country;
        this.createdUser = createdUser;
        this.updatedUser = updatedUser;
        this.addresserName = addresserName;
        this.isActive = isActive
    }
}