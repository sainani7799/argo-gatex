import { GlobalResponseObject } from "../../../shared-models/src/common";
import { CreateDepartmentDto } from "./create-department.dto";

export class GetAllDepartmentResponse extends GlobalResponseObject {
    data?: CreateDepartmentDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: CreateDepartmentDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}