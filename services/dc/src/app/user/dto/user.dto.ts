import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    userId: Number;

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
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    // @ApiProperty()
    // createdUser: string;

    @ApiProperty()
    versionFlag: number;
}