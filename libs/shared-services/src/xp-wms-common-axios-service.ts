import { AxiosRequestConfig } from 'axios'; 
import { config as appConfig } from '../config';
import { AxiosInstance } from './axios-instance';



export class XPWMSCommonAxiosService {
    URL = appConfig.XP_APP_WMS_SERVICE_URL;
    axiosPostCall = async (urlEndPoint: string, data?: any, config?: AxiosRequestConfig) => {
        return await AxiosInstance.post(this.URL + '' + urlEndPoint, data, config)
            .then(response => {
                if (response && (response.status >= 200 && response.status < 300)) {
                    return response.data;
                } else {
                    throw response;
                }
            }).catch(err => {
                throw new Error(err.message);
            })
    }
}