import { GatePassOutReq, GlobalResponseObject } from '@gatex/shared-models';
import { AxiosRequestConfig } from 'axios';
import { SPSCommonAxiosService } from '../sps-common-axios.service';

export class SubContractingService extends SPSCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/job-sub-contracting/' + childUrl;
    }

    async onGatePassApprovalForOutReq(reqModel: GatePassOutReq, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('onGatePassApprovalForOutReq'), reqModel, config);
    }

}