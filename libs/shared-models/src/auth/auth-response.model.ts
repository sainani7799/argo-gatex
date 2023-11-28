import { GlobalResponseObject } from "../common";
import { AuthModel } from "./auth.model";

export class AuthResponseModel extends GlobalResponseObject {
  data?: AuthModel;

  /**
   *
   * @param status
   * @param errorCode
   * @param internalMessage
   * @param data
   */

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data?: AuthModel
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}