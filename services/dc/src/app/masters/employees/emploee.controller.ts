import { Controller } from '@nestjs/common';
import { Body, Get, Post } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dto/employee.dto';
import { CreateEmployeeDto, GetAllEmployeeResponse } from 'libs/shared-models';
import { EmployeeRequest } from './dto/employee.request';
import { ReportingRequest } from './dto/reporting-manager.dto';

@Controller('employees')
@ApiTags('employees')
export class EmployeeController {
    applicationExceptionHandler: any;
    constructor(private readonly service: EmployeeService) { }

    @Post('/createEmployee')
    async createEmployee(@Body() createDto: any, isUpdate: boolean = false): Promise<any> {
        try {
            return await this.service.createEmployee(createDto);
        } catch (error) {
            return (error);
        }
    }

    @Post('/updateEmployee')
    async updateEmployee(@Body() createDto: any, isUpdate: boolean = false): Promise<any> {
        try {
            return await this.service.createEmployee(createDto);
        } catch (error) {
            return (error)
        }
    }


    // @Post('getAllEmployees')
    // async getAllEmployees(): Promise<GetAllEmployeeResponse> {
    //     try {
    //         return await this.service.getAllEmployees();

    //     } catch (error) {
    //         return (error);
    //     }
    // }

    @Get('/getAllEmployees')
    async getAllEmployees(): Promise<GetAllEmployeeResponse> {
        try {
            return await this.service.getAllEmployees();
        } catch (err) {
            console.error('Error in controller:', err);
        }
    }

    @Post('getAllEmployeesById')
    async getAllEmployeesById(@Body() req: ReportingRequest): Promise<GetAllEmployeeResponse> {
        try {
            return await this.service.getAllEmployeesById(req);
        } catch (error) {
            return (error);
        }
    }

    // @Post('getManagerByOperator')
    // async getManagerByOperator(@Body() req:EmployeeRequest): Promise<GetAllEmployeeResponse> {
    //     try {
    //         return await this.service.getManagerByOperator(req);
    //     } catch (error) {
    //         return (error);
    //     }
    // }


}
