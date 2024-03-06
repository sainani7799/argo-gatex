import { DcEmailModel } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";

export class EmailService extends CommonAxiosServicePms {
    private Mail = '/mailer';
    private dcController = '/dc';
    
    async sendDcMail(req: DcEmailModel) {
        return await this.axiosPostCall(this.dcController + '/sendDcMail', req)
    }
    
    async updateMailStatus(slNo: any, ) {
        return await this.axiosMailPostCall(`updateMailStatus?slNo=${slNo}`)
        
    }
}