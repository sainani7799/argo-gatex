import { AxiosRequestConfig } from 'axios';
import { XPWMSCommonAxiosService } from '../xp-wms-common-axios-service';
import { ADDVehicleReqModal, SecurityCheckRequest } from '@gatex/shared-models';
import { GlobalResponseObject } from '@gatex/shared-models';

export class GrnServices extends XPWMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/grn/' + childUrl;
    }

    async saveSecurityCheckIn(reqModel: ADDVehicleReqModal, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveSecurityCheckIn'), reqModel, config);
    }

    async saveSecurityCheckOut(reqModel: SecurityCheckRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveSecurityCheckOut'), reqModel, config);
    }


}