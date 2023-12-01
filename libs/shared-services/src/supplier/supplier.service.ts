
import { SupplierDto } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { AxiosRequestConfig } from "axios";

export class SupplierService extends CommonAxiosServicePms {
    private SupplierController = '/suppliers'

    async createSupplier(createDto: SupplierDto[]): Promise<any> {
        return  this.axiosPostCall(this.SupplierController +'/createSupplier', createDto, );
    }
}