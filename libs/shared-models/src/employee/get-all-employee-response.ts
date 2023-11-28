import { GlobalResponseObject } from "../../../shared-models/src/common";
import { CreateEmployeeDto } from "./create-employee.dto";

export class GetAllEmployeeResponse extends GlobalResponseObject {
    data?: CreateEmployeeDto;
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: CreateEmployeeDto) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}