import { WhatsAppMessageTemplateDto } from "./whatsAppMessageTemplate.dto";

export class MessageParameters{
    recepient : string;
    template : string;
    parameters : any
    languageCode ? : string
    buttonParameter1?:string
    buttonParameter2?:string
    constructor (recepient:string,template:string, parameters :any,languageCode?:string,buttonParameter1?:string,buttonParameter2?:string) {
        this.recepient = recepient;
        this.template = template;
        this.parameters = parameters;
        this.languageCode = languageCode
        this.buttonParameter1 = buttonParameter1;
        this.buttonParameter2 = buttonParameter2;
    }
}
