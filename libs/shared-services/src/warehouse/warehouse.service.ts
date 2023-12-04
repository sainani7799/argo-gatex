import { CreateWarehouseDto } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { AxiosRequestConfig } from "axios";

export class WarehouseService extends CommonAxiosServicePms {
    private WarehouseController = '/warehouse-controller'

    async createWarehouse(createDto: CreateWarehouseDto, config?: AxiosRequestConfig): Promise<any> {
        return await this.axiosPostCall(this.WarehouseController +'/createWarehouse', createDto, config);
    }

    async getAllWarehouse(): Promise<any> {
        return await this.axiosGetCall(this.WarehouseController + '/getAllWarehouses')
    }
}