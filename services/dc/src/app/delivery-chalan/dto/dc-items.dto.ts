import { ApiProperty } from "@nestjs/swagger";

export class DcItemsDto{
    @ApiProperty()
    dcItemId:number;
    @ApiProperty()
    itemCode:string;
    @ApiProperty()
    itemName:string;
    @ApiProperty()
    description:string;
    @ApiProperty()
    uom:string;
    @ApiProperty()
    qty:number;
    @ApiProperty()
    rate:number;
    @ApiProperty()
    amount:string;
    @ApiProperty()
    isActive?: boolean;
    @ApiProperty()
    createdAt?: Date;
    @ApiProperty()
    createdUser?: string | null;
    @ApiProperty()
    updatedAt?: Date;
    @ApiProperty()
    updatedUser?: string | null;
    constructor(dcItemId:number, itemCode:string, itemName:string, description:string, uom:string, qty:number, rate:number, amount:string, isActive?: boolean, createdAt?: Date, createdUser?: string | null, updatedAt?: Date, updatedUser?: string | null,
    ){
        this.dcItemId = dcItemId 
        this.itemCode = itemCode 
        this.itemName = itemName
        this.description = description
        this.uom = uom
        this.qty = qty
        this.rate = rate
        this.amount = amount
        this.isActive = isActive
        this.createdAt = createdAt
        this.createdUser = createdUser
        this.updatedAt = updatedAt
        this.updatedUser = updatedUser
    }

}