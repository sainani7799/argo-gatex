import { ApiProperty } from "@nestjs/swagger";

export class DcItemsDto {
    @ApiProperty()
    dcItemId: number;
    @ApiProperty()
    itemCode: string;
    @ApiProperty()
    itemName: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    itemType: string;
    @ApiProperty()
    uom: string;
    @ApiProperty()
    qty: number;
    @ApiProperty()
    rate: number;
    @ApiProperty()
    amount: string;
    @ApiProperty()
    poNumber: string;
    @ApiProperty()
    color: string;
    @ApiProperty()
    style: string;
    @ApiProperty()
    pieces: string;
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
    constructor(dcItemId: number, itemCode: string, itemName: string, description: string, itemType: string, uom: string, qty: number, rate: number, amount: string, poNumber: string, color: string, style: string, pieces: string, isActive?: boolean, createdAt?: Date, createdUser?: string | null, updatedAt?: Date, updatedUser?: string | null
    ) {
        this.dcItemId = dcItemId
        this.itemCode = itemCode
        this.itemName = itemName
        this.description = description
        this.itemType = itemType;
        this.uom = uom
        this.qty = qty
        this.rate = rate
        this.amount = amount
        this.poNumber = poNumber
        this.color = color
        this.style = style
        this.pieces = pieces
        this.isActive = isActive
        this.createdAt = createdAt
        this.createdUser = createdUser
        this.updatedAt = updatedAt
        this.updatedUser = updatedUser
    }

}