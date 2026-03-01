import { CreateDepartmentDto, DepartmentIdReq } from "@gatex/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { AxiosRequestConfig } from "axios";
import { CommonResponse } from "@gatex/shared-models";


export class DepartmentService extends CommonAxiosServicePms {
      private DepartmentController = '/departmentdata'
    
    async createDepartment(createDto: CreateDepartmentDto, config?: AxiosRequestConfig): Promise<any> {
        return await this.axiosPostCall(this.DepartmentController +'/createDepartment', createDto, config);
    }
    async getAllDepartments(): Promise<any> {
        return await this.axiosPostCall(this.DepartmentController + '/getAllDepartments')
    }

    async getAllSectionsForDrop(Req:DepartmentIdReq): Promise<CommonResponse> {
        return await this.axiosPostCall(this.DepartmentController + '/getAllSectionsForDrop',Req)
    }

}




