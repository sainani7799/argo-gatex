import { CommonResponse, PkShippingRequestCheckoutRequest, PkShippingRequestIdRequest } from '@gatex/shared-models';
import { AxiosRequestConfig } from 'axios';
import { PkDMSCommonAxiosService } from '../common-axios.service';

export class PkShippingRequestService extends PkDMSCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/shipping-request/' + childUrl;
    }

    async validateCheckoutShippingRequest(reqModel: PkShippingRequestIdRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('validateCheckoutShippingRequest'), reqModel, config);
    }

    async checkoutShippingRequest(reqModel: PkShippingRequestCheckoutRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('checkoutShippingRequest'), reqModel, config);
    }
}