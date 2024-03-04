import { CreateWarehouseDto, UnitReq } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { AxiosRequestConfig } from "axios";

export class WarehouseService extends CommonAxiosServicePms {
    private WarehouseController = '/warehouse-controller'
    private unitUrl = '/unitData'

    async createWarehouse(createDto: CreateWarehouseDto): Promise<any> {
        return await this.axiosPostCall(this.WarehouseController +'/createWarehouse', createDto, );
    }
    async updateWarehouse(createDto: CreateWarehouseDto): Promise<any> {
        return await this.axiosPostCall(this.WarehouseController +'/updateWarehouse', createDto, );
    }
    async getAllWarehouse(): Promise<any> {
        return await this.axiosGetCall(this.WarehouseController + '/getAllWarehouses')
    }
    async getAllWarehousesByUnit(req:UnitReq): Promise<any> {
        return await this.axiosPostCall(this.WarehouseController + '/getAllWarehousesByUnit',req)
    }
    async activateOrDeactivateWarehouse(  req: CreateWarehouseDto): Promise<any> {
        return this.axiosPostCall(this.WarehouseController + '/activateOrDeactivateWarehouse', req)
      }

      async activateOrDeactivateUnits(  req: UnitReq): Promise<any> {
        return this.axiosPostCall(this.unitUrl + '/activateOrDeactivateUnits', req)
      }
}