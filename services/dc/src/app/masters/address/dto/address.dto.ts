import { ApiProperty } from "@nestjs/swagger";

export class CreateAddressDto {
    @ApiProperty()
    addressId: number;

    @ApiProperty()
    addresser: string;

    @ApiProperty()
    addresserNameId:number;

    @ApiProperty()
    gstNo:string;

    @ApiProperty()
    cstNo:string;

    @ApiProperty()
    lineOne:string;

    @ApiProperty()
    lineTwo:string;

    @ApiProperty()
    city:string;

    @ApiProperty()
    dist:string;

    @ApiProperty()
    pinCode:number;

    @ApiProperty()
    state:string;

    @ApiProperty()
    country:string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    createdUser: string;

    @ApiProperty()
    updatedUser: string;

    @ApiProperty()
    versionFlag: number;
}