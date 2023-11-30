import { ApiProperty } from "@nestjs/swagger";

export class CreateAddressDto {
    @ApiProperty()
    addressId: number;

    @ApiProperty()
    addresser: string;

    @ApiProperty()
    addresserName:number;

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
    versionFlag: number;
}