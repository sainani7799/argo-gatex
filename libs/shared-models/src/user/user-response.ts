import { GlobalResponseObject } from "../common";
import { UserModel } from "./user-info.model";

export class UserResponse extends GlobalResponseObject {
    data: UserModel[];

    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */
    constructor(status: boolean, errorCode: number, internalMessage: string,data:UserModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}