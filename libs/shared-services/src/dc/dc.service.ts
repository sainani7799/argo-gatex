import { DcReq } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";

export class DcService extends CommonAxiosServicePms {
    private DcController = '/dc-controller';
    async createDc(createDto: DcReq): Promise<any> {
        return await this.axiosPostCall(this.DcController +'/createDc', createDto );
    }
}