import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EmployeeDto } from './dto/employee.dto';
import { EmployeeRepository } from './repo/employee.repo';
import { EmployeeEntity } from './entity/employee.entity';
import { EmployeeAdapter } from './adapter/employee.adapter';
import { EmployeeRequest } from './dto/employee.request';
import { ErrorResponse } from 'libs/backend-utils/src/lib/libs/global-res-object';
import { ReportingRequest } from './dto/reporting-manager.dto';
import { CommonResponse } from 'libs/shared-models/src/common';
import { CreateEmployeeDto, GetAllEmployeeResponse } from 'libs/shared-models';
import { AppDataSource } from '../../app-data-source';


@Injectable()
export class EmployeeService {

  constructor(
    // @InjectRepository(EmployeeEntity)
    private employeeRepo: EmployeeRepository,
    private adapter: EmployeeAdapter,
    // @InjectDataSource() private dataSource: DataSource,
  ) { }

  async createEmployee(createDto: CreateEmployeeDto): Promise<GetAllEmployeeResponse> {
    try {
      const save = this.adapter.convertDtoToEntity(createDto);
      console.log('Received DTO:', createDto);
      console.log('Converted Entity:', save);

      let internalMessage: string;

      if (createDto.employeeId) {
        const findRecord = await AppDataSource.getRepository(EmployeeEntity).findOne({ where: { employeeId: createDto.employeeId } });

        if (findRecord && findRecord.versionFlag !== createDto.versionFlag) {
          // Handle versionFlag mismatch if necessary
        }

        internalMessage = 'Updated Successfully';
      } else {
        internalMessage = 'Created Successfully';
      }

      const savedData = await AppDataSource.getRepository(EmployeeEntity).save(save);

      console.log('Saved Data:', savedData);

      return new GetAllEmployeeResponse(true, 454, 'success', savedData);
    } catch (error) {
      console.error('Error creating/updating employee:', error);
      throw new InternalServerErrorException('Internal server error');
    }
  }


  // async createEmployee(createDto: CreateEmployeeDto): Promise<CommonResponse> {
  //   try{
  //     const save = this.adapter.convertDtoToEntity(createDto);
  //     console.log(createDto,'createDto')
  //     console.log(save,'save')
  //     let internalMessage: string;
  //     if (createDto.employeeId) {
  //       internalMessage = "Updated Successfully"
  //       const findRecord = await projectPlanningDataSource.getRepository(EmployeeEntity).findOne({ where: { employeeId: createDto.employeeId } });
  //       if (findRecord.versionFlag !== createDto.versionFlag) {
  //   }
  //     } else {
  //       internalMessage = "Created Successfully"
  //     }
  //     const savedData = await projectPlanningDataSource.getRepository(EmployeeEntity).save(save);
  //   console.log(savedData,'savedData')
  //   return { data: savedData, message: internalMessage }
  //   }catch (error) {
  //     console.error('Error creating/updating employee:', error);
  //     throw new InternalServerErrorException('Internal server error'); // or handle the error in an appropriate way
  //   }



  // }



  async getAllEmployees(): Promise<CommonResponse> {
    try {
      const employeeData = await AppDataSource.getRepository(EmployeeEntity).query(`select e.employee_id AS employeeId, e.employee_name AS employeeName,e.employee_code AS employeeCode,e.card_no AS cardNo,e.email_id AS emailId,
      e.gender,e.date_of_birth AS dateOfBirth,e.address ,d.department_name AS departmentName,s.section_name AS section, de.designation,e.mobile_number AS mobileNumber,u.id as unitId,u.unit_name AS unit from shahi_employees e
      left join shahi_department d on d.id = e.department 
      left join shahi_designation de on de.designation_id = e.designation
	    left join shahi_sections s on s.section_id = e.section
      left join shahi_units u on u.unit_code = e.unit`);
      // console.log(employeeData, 'employeeData');
      if (employeeData.length > 0) {
        return new CommonResponse(true, 221, 'Data retrieved', employeeData);
      } else {
        return new CommonResponse(false, 0, 'No data found');
      }
    } catch (err) {
      // console.error('Error fetching employee data:', err);
      throw err; // Rethrow the error to indicate the failure 
    }

  }

  async getAllActiveEmployees(): Promise<any> {
    const data = await this.employeeRepo.find({ where: { isActive: true } });
    if (data.length === 0) {
      console.log('active employee')
    }
    return data
  }

  async getAllEmployeesById(req: ReportingRequest): Promise<any> {
    let query = `SELECT employee_id AS employeeId, employee_name AS employeeName FROM Employees WHERE reporting_manager = ${req.reportingManager}`
    const data = await this.employeeRepo.query(query);
    return data


    // const data = await this.employeeRepo.find({where:{reportingManager:createDto.employeeId}});

    // return data
  }




  async getEmployeeById(employeeId: number): Promise<any> {
    const response = await this.employeeRepo.findOne({
      where: { employeeId: employeeId },
    });
    if (response) {
      return response;
    } else {
      return null;
    }
  }

  async activateOrDeactivateEmployee(employeeReq: EmployeeRequest): Promise<any> {
    try {
      const employeeExists = await this.getEmployeeById(employeeReq.employeeId);
      if (employeeExists) {
        if (employeeReq.versionFlag != employeeExists.versionFlag) {
          throw new ErrorResponse(10113, 'Someone updated the current employee information. Refresh and try again');
        } else {
          const employeeStatus = await this.employeeRepo.update(
            { employeeId: employeeReq.employeeId },
            {
              isActive: employeeReq.isActive,
              //  updatedUser: employeeReq.updatedUser 
            }
          );
          if (employeeExists.isActive) {
            if (employeeStatus.affected) {
              const employeeResponse: any = new ErrorResponse(10115, 'employee is de-activated successfully');
              return employeeResponse;
            } else {
              throw new ErrorResponse(10111, 'employee is already de-activated');
            }
          } else {
            if (employeeStatus.affected) {
              const employeeResponse: any = new ErrorResponse(10114, 'employee is activated successfully');
              return employeeResponse;
            } else {
              throw new ErrorResponse(10112, 'employee is already activated');
            }
          }
        }
      } else {
        throw new ErrorResponse(99998, 'No Records Found');
      }
    } catch (err) {
      throw err;
    }
  }

  // async getManagerByOperator(req:EmployeeRequest) : Promise<any>{
  //   let query = `SELECT emp.employee_name AS employeeName , emp.employee_id AS employeeId FROM employee_manager_relation er LEFT JOIN employees emp ON emp.employee_id = er.relation_id WHERE er.employee_id = ${req.employeeId}`
  //   const data = await this.dataSource.query(query);
  //   return data;
  // }


}
