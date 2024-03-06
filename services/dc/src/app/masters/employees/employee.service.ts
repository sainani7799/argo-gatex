import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmployeeRepository } from './repo/employee.repo';
import { EmployeeAdapter } from './adapter/employee.adapter';
import { EmployeeRequest } from './dto/employee.request';
import { ErrorResponse } from 'libs/backend-utils/src/lib/libs/global-res-object';
import { ReportingRequest } from './dto/reporting-manager.dto';
import { CommonResponse } from 'libs/shared-models/src/common';
import { CreateEmployeeDto, GetAllEmployeeResponse, ToEmpReq, UnitReq } from 'libs/shared-models';

@Injectable()
export class EmployeeService {

  constructor(
    private employeeRepo: EmployeeRepository,
    private adapter: EmployeeAdapter,
  ) { }

  async createEmployee(createDto: CreateEmployeeDto, isUpdate: boolean): Promise<GetAllEmployeeResponse> {
    try {
      if (createDto.employeeId ==undefined) {
        const findRecord = await this.employeeRepo.find({ where: { employeeCode: createDto.employeeCode } });
        console.log(findRecord, 'find record')
        if (findRecord.length) {
          return new GetAllEmployeeResponse(false, 1111, "Employee details is Already exsits");
        }
      }
      const save = this.adapter.convertDtoToEntity(createDto);

      const savedData = await this.employeeRepo.save(save);
      return new GetAllEmployeeResponse(true, 1, isUpdate ? 'Employee Updated Successfully' : 'Employee created Successfully');
    } catch (error) {
      console.error('Error creating/updating employee:', error);
      return new GetAllEmployeeResponse(false,0,'Internal server error');
    }
  }

  async deactiveEmployee(req: any): Promise<CommonResponse> {
    const deactiveEmployee = await this.employeeRepo.update({ employeeId: req.employeeId }, { isActive: false })
    if (deactiveEmployee.affected) return new CommonResponse(true, 1, 'Employee deleted')
    return new CommonResponse(false, 0, 'Error while deleting employee')
  }

  async getAllEmployees(): Promise<CommonResponse> {
    try {
      const query = `select e.is_active AS isActive, e.employee_id AS employeeId, e.employee_name AS employeeName,e.employee_code AS employeeCode,e.card_no AS cardNo,e.email_id AS emailId,
      e.gender,e.date_of_birth AS dateOfBirth,e.address ,e.department,d.department_name AS departmentName,s.section_name AS sectionName,e.section ,e.designation,de.designation AS designationName,e.mobile_number AS mobileNumber,u.id as unitId,u.unit_name AS unitName ,e.unit from shahi_employees e
      left join shahi_department d on d.id = e.department 
      left join shahi_designation de on de.designation_id = e.designation
	    left join shahi_sections s on s.section_id = e.section
      left join shahi_units u on u.unit_code = e.unit WHERE e.is_active = 1 `
      const employeeData = await this.employeeRepo.query(query);
      if (employeeData.length > 0) {
        return new CommonResponse(true, 221, 'Data retrieved', employeeData);
      } else {
        return new CommonResponse(false, 0, 'No data found');
      }
    } catch (err) {
      throw err;
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
  }

  async getAllEmployeesByUnit(req: UnitReq): Promise<CommonResponse> {
    try {
      const employeeData = await this.employeeRepo.query(`select e.employee_id AS employeeId, e.employee_name AS employeeName,e.employee_code AS employeeCode,e.card_no AS cardNo,e.email_id AS emailId,
      e.gender,e.date_of_birth AS dateOfBirth,e.address ,d.department_name AS departmentName,s.section_name AS section, de.designation,e.mobile_number AS mobileNumber,u.id as unitId,u.unit_name AS unit from shahi_employees e
      left join shahi_department d on d.id = e.department 
      left join shahi_designation de on de.designation_id = e.designation
	    left join shahi_sections s on s.section_id = e.section
      left join shahi_units u on u.unit_code = e.unit where u.id = ${req.unitId}`);
      if (employeeData.length > 0) {
        return new CommonResponse(true, 221, 'Data retrieved', employeeData);
      } else {
        return new CommonResponse(false, 0, 'No data found');
      }
    } catch (err) {
      throw err;
    }

  }

  async getAllToEmployeesByUnit(req: ToEmpReq): Promise<CommonResponse> {
    try {
      let query = `select e.employee_id AS employeeId, e.employee_name AS employeeName,e.employee_code AS employeeCode,e.card_no AS cardNo,e.email_id AS emailId,e.department,
      e.gender,e.date_of_birth AS dateOfBirth,e.address ,d.department_name AS departmentName,s.section_name AS section, de.designation,e.mobile_number AS mobileNumber,u.id as unitId,u.unit_name AS unit from shahi_employees e
      left join shahi_department d on d.id = e.department 
      left join shahi_designation de on de.designation_id = e.designation
	    left join shahi_sections s on s.section_id = e.section
      left join shahi_units u on u.unit_code = e.unit `
      if (req.unitId > 0) {
        query = query + ' where u.id = ' + req.unitId;
      }
      if (req.departmentId > 0) {
        query = query + ' and e.department = ' + req.departmentId;
      };
      const employeeData = await this.employeeRepo.query(query)
      return new CommonResponse(true, 221, 'Data retrieved', employeeData);
    } catch (err) {
      throw err;
    }
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


}
