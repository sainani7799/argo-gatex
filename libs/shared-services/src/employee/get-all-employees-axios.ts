import { AxiosRequestConfig } from "axios";
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { CreateEmployeeDto, UnitReq, } from "libs/shared-models/src";


export class EmployeeService extends CommonAxiosServicePms {
    private EmployeeController ='/employees'

    async createEmployee(createDto: CreateEmployeeDto, config?: AxiosRequestConfig): Promise<any> {
        return await this.axiosPostCall(this.EmployeeController +'/createEmployee', createDto, config);
    }

    async updateEmployee(createDto: CreateEmployeeDto, config?: AxiosRequestConfig): Promise<any> {
        return await this.axiosPostCall(this.EmployeeController +'/updateEmployee', createDto, config);
    }

    async getAllEmployees(): Promise<any> {
        return await this.axiosGetCall(this.EmployeeController + '/getAllEmployees')
    }

    async getAllEmployeesByUnit(req: UnitReq): Promise<any> {
        return await this.axiosPostCall(this.EmployeeController +'/getAllEmployeesByUnit', req);
    }

    async getAllToEmployeesByUnit(req: UnitReq): Promise<any> {
        return await this.axiosPostCall(this.EmployeeController +'/getAllToEmployeesByUnit', req);
    }

    async activateOrDeactivateEmployee(createDto: CreateEmployeeDto): Promise<any> {
        return await this.axiosPostCall(this.EmployeeController +'/activateOrDeactivateEmployee', createDto);
    }

    
}




