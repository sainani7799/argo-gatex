import { SupplierDto } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { AxiosRequestConfig } from "axios";

export class RoleService extends CommonAxiosServicePms {
    private RoleController = '/roledata'

    async getAllRoleEntity(): Promise<any> {
        return await this.axiosGetCall(this.RoleController +'/getAllRoleEntity' );
    }
    
}