import { Injectable } from '@nestjs/common';
import { EmployeeEntity } from '../entity/employee.entity';
import { CreateEmployeeDto } from 'libs/shared-models';

@Injectable()
export class EmployeeAdapter {
    convertDtoToEntity(employeeDto: CreateEmployeeDto): EmployeeEntity {
        const entity = new EmployeeEntity();
        entity.employeeCode = employeeDto.employeeCode;
        entity.employeeName = employeeDto.employeeName;
        entity.cardNo = employeeDto.cardNo;
        entity.designation = employeeDto.designation;
        entity.dateOfBirth = employeeDto.dateOfBirth;
        entity.gender = employeeDto.gender;
        entity.maritalStatus = employeeDto.maritalStatus;
        entity.mobileNumber = employeeDto.mobileNumber;
        entity.emailId = employeeDto.emailId;
        entity.department = employeeDto.department;
        entity.section = employeeDto.section;
        entity.unit = employeeDto.unit;
        entity.address = employeeDto.address;
        
        if (employeeDto.employeeId) {
            entity.employeeId = employeeDto.employeeId;
        }
        
        console.log(entity, 'entity');
        return entity;
    }
}
