import { CommonAxiosServicePms } from "../common-axios-service-prs";

export class DesignationService extends CommonAxiosServicePms {
    private DesignationController = '/designation'
  
  async getAllDesignations(): Promise<any> {
      return await this.axiosPostCall(this.DesignationController + '/getAllDesignations')
  }

}