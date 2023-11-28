import { AxiosRequestConfig } from "axios";
import { CreateUnitDto } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";


export class UnitService extends CommonAxiosServicePms {
 
    private UnitController ='/unitData'
    
    async createBranch(createDto: CreateUnitDto, config?: AxiosRequestConfig): Promise<any> {
        return await this.axiosPostCall(this.UnitController +'/createUnit', createDto, config);
    }

    async getAllUnits(): Promise<any> {
        return await this.axiosGetCall(this.UnitController + '/getAllUnits')
    }
}




