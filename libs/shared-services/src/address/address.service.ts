import { CreateAddressDto, ToAddressReq, UnitReq } from "@gatex/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { AxiosRequestConfig } from "axios";

export class AddressService extends CommonAxiosServicePms {
    private AddressController = '/address'

    async createAddress(createDto: CreateAddressDto): Promise<any> {
        return await this.axiosPostCall(this.AddressController +'/createAddress', createDto, );
    }

    async updateAddress(createDto: CreateAddressDto): Promise<any> {
        return await this.axiosPostCall(this.AddressController +'/updateAddress', createDto, );
    }

    async getAllAddress(): Promise<any> {
        return await this.axiosGetCall(this.AddressController +'/getAllAddress' );
    }

    async getAllAddressByUnit(req: UnitReq): Promise<any> {
        return await this.axiosPostCall(this.AddressController +'/getAllAddressByUnit', req, );
    }

    async getAllToAddressByUnit(req: ToAddressReq): Promise<any> {
        return await this.axiosPostCall(this.AddressController +'/getAllToAddressByUnit', req, );
    }
    async activateOrDeactivateAddress(  req: CreateAddressDto): Promise<any> {
        return this.axiosPostCall(this.AddressController + '/activateOrDeactivateAddress', req)
    
      }
}