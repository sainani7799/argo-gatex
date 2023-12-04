import { ApiProperty } from "@nestjs/swagger";

export class CreateSupplierDto {
    @ApiProperty()
    supplierId: number;

    @ApiProperty()
    supplierName: string;
    
    @ApiProperty()
    supplierCode: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    createdUser: string;

    @ApiProperty()
    versionFlag: number;
}