import { ApiProperty } from "@nestjs/swagger";

export class UserRequestDto {
    @ApiProperty()
    employeeId: any;
}