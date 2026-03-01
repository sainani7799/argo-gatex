import { ApiProperty } from "@nestjs/swagger";

export class VehicleDto {
    @ApiProperty()
    vehicleId: number;

    @ApiProperty()
    dcId: number;

    @ApiProperty()
    vehicleType: string;

    @ApiProperty()
    vehicleNo: string;

    @ApiProperty()
    driverName: string;

    @ApiProperty()
    driverPhone: string;

    @ApiProperty()
    invoiceNo: string;

    @ApiProperty()
    securityPerson: string;

    @ApiProperty()
    inTime: Date;

    @ApiProperty()
    outTime: Date;

    @ApiProperty()
    netWeight: number;

    @ApiProperty()
    grossWeight: number;

    @ApiProperty()
    cusDecNo: string;

    @ApiProperty()
    containerNo: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    createdUser: string;

    @ApiProperty()
    updatedUser: string;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    versionFlag: number;
}
