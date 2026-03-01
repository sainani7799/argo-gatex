/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './emploee.controller';
import { EmployeeEntity } from './entity/employee.entity';
import { EmployeeAdapter } from './adapter/employee.adapter';
import { EmployeeRepository } from './repo/employee.repo';
import { ApplicationExceptionHandler } from 'libs/backend-utils/src/lib/libs/application-exception-handler';

@Module({
    imports: [TypeOrmModule.forFeature([
        // EmployeeEntity,EmployeeAdapter
    ])],
    controllers: [EmployeeController],
    providers: [EmployeeService,EmployeeAdapter,EmployeeRepository,ApplicationExceptionHandler],
    exports: [EmployeeService],
})
export class EmployeeModule { }
