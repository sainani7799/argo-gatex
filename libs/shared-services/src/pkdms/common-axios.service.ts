import { AxiosRequestConfig } from 'axios';
import { AxiosInstance } from '../axios-instance';
import { configVariables } from 'libs/shared-services/config';

export class PkDMSCommonAxiosService {
    URL = configVariables.APP_PKDMS_SERVICE_URL;
    axiosPostCall = async (urlEndPoint: string, data?: any, config?: AxiosRequestConfig) => {
        console.log("PKDMS URL:", this.URL)
        return await AxiosInstance.post(this.URL + '' + urlEndPoint, data, config)
            .then(response => {
                if (response && (response.status >= 200 && response.status < 300)) {
                    return response.data;
                } else {
                    throw response;
                }
            }).catch(err => {
                throw new Error(`Error: ${err.message}, PKDMS URL: ${this.URL}`);
                
            })
    }
}