export class GlobalResponseObject {
    status: boolean;
    errorCode: number;
    internalMessage: string;
    /**
     *
     * @param status
     * @param errorCode
     * @param internalMessage
     */
    constructor(status: boolean, errorCode: number, internalMessage: string){
        this.status = status;
        this.errorCode = errorCode;
        this.internalMessage = internalMessage;
    }
}

export class ErrorResponse extends Error {
    errorCode: number;
    message: string;
    constructor(errorCode: number, message: string) {
        super();
        this.errorCode = errorCode;
        this.message = message;
    }
}