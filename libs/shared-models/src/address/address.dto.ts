export class CreateAddressDto {
    addressId: number;
    addresser: string;
    addresserName:number;
    lineOne:string;
    lineTwo:string;
    city:string;
    dist:string;
    pinCode:number;
    state:string;
    country:string;
    createdUser: string;
    constructor(addressId: number,addresser: string,addresserName:number,lineOne:string,lineTwo:string,city:string,dist:string,pinCode:number,state:string,country:string,createdUser: string){
        this.addressId = addressId;
        this.addresser = addresser;
        this.addresserName = addresserName;
        this.lineOne = lineOne;
        this.lineTwo = lineTwo;
        this.city = city;
        this.dist = dist;
        this.pinCode = pinCode;
        this.state = state;
        this.country = country;
        this.createdUser = createdUser;
    }
}