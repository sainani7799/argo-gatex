import { CommonResponse } from "libs/shared-models/src/common";
import { CommonAxiosServicePms } from "../common-axios-service-prs";

export class VHRServices extends CommonAxiosServicePms {
    private VHRController = '/vhr';

    async getVINRALL(req?: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.VHRController + '/getVINRALL', req);
    }

    async getVOTRALL(req?: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.VHRController + '/getVOTRALL', req);
    }

    async createVehicle(req?: any[]): Promise<CommonResponse> {
        return await this.axiosPostCall(this.VHRController + '/createVehicle', req);
    }

    async updateVehicleState(req?: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.VHRController + '/updateVehicleState', req);
    }

}
