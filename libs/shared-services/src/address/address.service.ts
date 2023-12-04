import { CreateAddressDto } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { AxiosRequestConfig } from "axios";

export class AddressService extends CommonAxiosServicePms {
    private AddressController = '/address'

    async createAddress(createDto: CreateAddressDto): Promise<any> {
        return await this.axiosPostCall(this.AddressController +'/createAddress', createDto, );
    }

    async getAllAddress(): Promise<any> {
        return await this.axiosGetCall(this.AddressController +'/getAllAddress' );
    }
}