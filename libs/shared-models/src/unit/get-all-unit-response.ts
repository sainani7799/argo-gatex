import { GlobalResponseObject } from "../common";
import { CreateUnitDto } from "./create-unit.dto";

export class GetAllUnitResponse extends GlobalResponseObject {
    data?: CreateUnitDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: CreateUnitDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}