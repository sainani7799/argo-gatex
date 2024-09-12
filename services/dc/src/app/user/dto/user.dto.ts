import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    userId: number;

    @ApiProperty()
    userName: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    employeeId : number;

    @ApiProperty()
    cardNo : string;

    @ApiProperty()
    unitId:number;

    @ApiProperty()
    roleId:number;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    versionFlag: number;

    @ApiProperty()
    buyerTeam: string;
}