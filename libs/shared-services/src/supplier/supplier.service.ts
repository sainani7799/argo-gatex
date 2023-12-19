import { SupplierDto } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { AxiosRequestConfig } from "axios";

export class SupplierService extends CommonAxiosServicePms {
    private SupplierController = '/suppliers'

    async createSupplier(createDto: SupplierDto): Promise<any> {
        return await this.axiosPostCall(this.SupplierController +'/createSupplier', createDto, );
    }
    async updateSupplier(createDto: SupplierDto): Promise<any> {
        return await this.axiosPostCall(this.SupplierController +'/updateSupplier', createDto, );
    }
    async getAllSuppliers(): Promise<any> {
        return await this.axiosGetCall(this.SupplierController + '/getAllSuppliers')
    }
    async activateOrDeactivateSupplier(  req: SupplierDto): Promise<any> {
        return this.axiosPostCall(this.SupplierController + '/activateOrDeactivateSupplier', req)
    
      }
}