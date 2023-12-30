import { AcceptReq, AssignReq, DcIdReq, DcReq, ReceivedDcReq, RejectDcReq, SecurityCheckReq, UnitReq } from "libs/shared-models";
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
    async acceptDc(dto: AcceptReq): Promise<any> {
        return await this.axiosPostCall(this.DcController + '/acceptDc', dto);

    }

    async rejectDc(dto: RejectDcReq): Promise<any> {
        return await this.axiosPostCall(this.DcController + '/rejectDc', dto);

    }
    
    async getAllGatePass(req:UnitReq): Promise<any> {
        return await this.axiosPostCall(this.DcController + '/getAllGatePass',req);
    }

    async getIntransAndCompleteGatePass(req:UnitReq): Promise<any> {
        return await this.axiosPostCall(this.DcController + '/getIntransAndCompleteGatePass',req);
    }

    async getDcDetailsById(req: DcIdReq): Promise<any> {
        return await this.axiosPostCall(this.DcController + '/getDcDetailsById', req);

    }

    async receivedDc(dto: ReceivedDcReq): Promise<any> {
        return await this.axiosPostCall(this.DcController + '/receivedDc', dto);

    }

    async securityCheckDone(dto: SecurityCheckReq): Promise<any> {
        return await this.axiosPostCall(this.DcController + '/securityCheckDone', dto);

    }

    async getSecurityGatePass(dto: UnitReq): Promise<any> {
        return await this.axiosPostCall(this.DcController + '/getSecurityGatePass', dto);

    }
    
}

// // export async function acceptDc(dto) {
//     return await this.axiosPostCall(this.DcController + '/acceptDc', dto);
//   }
