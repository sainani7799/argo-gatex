import { AssignReq, DcIdReq, DcReq } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { CommonResponse } from "libs/shared-models/src/common";

export class DcService extends CommonAxiosServicePms {
    private DcController = '/dc';


    async createDc(dto: DcReq): Promise<any> {
        return await this.axiosPostCall(this.DcController + '/createDc', dto);

    }
    async updateDc(dto: AssignReq): Promise<any> {
        return await this.axiosPostCall(this.DcController + '/updateDc', dto);

    }
    async getAllGatePass(): Promise<any> {
        return await this.axiosGetCall(this.DcController + '/getAllGatePass');

    }

    async getDcDetailsById(req: DcIdReq): Promise<any> {
        return await this.axiosPostCall(this.DcController + '/getDcDetailsById', req);

    }
}
