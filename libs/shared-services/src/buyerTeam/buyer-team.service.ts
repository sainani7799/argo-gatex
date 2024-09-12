import { BuyerTeameDto } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { AxiosRequestConfig } from "axios";

export class BuyerTeamService extends CommonAxiosServicePms {
    private buyerTeamController = '/buyer-team'

    async createBuyer(createDto: BuyerTeameDto): Promise<any> {
        return await this.axiosPostCall(this.buyerTeamController +'/createBuyer', createDto, );
    }
    
    async getAllActiveBuyer(): Promise<any> {
        return await this.axiosPostCall(this.buyerTeamController + '/getAllActiveBuyer')
    }

    async updateBuyer(createDto: BuyerTeameDto): Promise<any> {
        return await this.axiosPostCall(this.buyerTeamController +'/updateBuyer', createDto, );
    }

    async deleteBuyer(buyerId: any): Promise<any> {
        return await this.axiosPostCall(this.buyerTeamController +'/deleteBuyer', buyerId, );
    }

}