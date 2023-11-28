import { IsNotEmpty, IsAlphanumeric, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ReportingRequest{

    @ApiProperty()
    reportingManager: number;

    @ApiProperty()
    @IsOptional()
    updatedUser: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    versionFlag: number;

    @ApiProperty()
    isActive: boolean;
}