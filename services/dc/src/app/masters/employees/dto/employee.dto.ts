import { ApiProperty } from "@nestjs/swagger";

/* eslint-disable prettier/prettier */
export class EmployeeDto {

    @ApiProperty()
    employeeId: number;

    @ApiProperty()
    employeeName: string;

    @ApiProperty()
    employeeCode: string;


    @ApiProperty()
    designation: string;

    @ApiProperty()
    dateOfBirth: Date;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    maritalStatus: string;

    @ApiProperty()
    mobileNumber: string;

    @ApiProperty()
    emailId: string;

    @ApiProperty()
    department: string;

    @ApiProperty()
    unit: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    createdUser: string;
  
    @ApiProperty()
    isActive: boolean;
  
    @ApiProperty()
    updatedUser: string | null;
  
    @ApiProperty()
    versionFlag: number;
  
  
    @ApiProperty()
    updatedAt: Date;
  
    @ApiProperty()
    createdAt: Date;
  
  
   

   


}