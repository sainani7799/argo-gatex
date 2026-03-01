import axios from 'axios';
import { whatsApp } from '../../../../services/dc/whatsapp';
import { MessageParameters, MessageRequest, MessageResponse } from '@gatex/shared-models';
import connection from './connection';
export class WhatsAppNotificationService {
    URL = connection.DEPLOY_URL;



    async sendPersonalMessage(message: MessageRequest): Promise<MessageResponse> {
        return await axios.post(this.URL + '/sendPersonalMessage', message).then((res) => {
            return res.data;
        });
    }

    async sendGroupMessage(message: MessageRequest): Promise<MessageResponse> {
        return await axios.post(this.URL + '/sendGroupMessage', message).then((res) => {
            return res.data;
        });
    }

    async sendMessageThroughFbApi(message: MessageParameters): Promise<MessageResponse> {
        return await axios.post(`https://graph.facebook.com/${whatsApp.VERSION}/${whatsApp.PHONE_NUMBER_ID}/messages`, {
            "messaging_product": "whatsapp",
            "to": message.recepient,
            "type": "template",
            "template": {
                "name": message.template,
                "language": {
                    "code": message.languageCode ? message.languageCode : "en_us"
                },
                "components": [
                    // {
                    //     "type": "header",
                    //     "parameters": [{ "type": "text", "text": "Sandhya Aqua" }]
                    // },
                    {
                        "type": "body",
                        "parameters": message.parameters,

                    }
                    
                ]
            }
        }, {
            "headers": {
                'Authorization': `Bearer ${whatsApp.ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
        }).then((res) => {
            return new MessageResponse(true,'success');
        }).catch(err => { return new MessageResponse(false,err) });
    }

    async sendMessageWithHeaderThroughFbApi(message: MessageParameters): Promise<MessageResponse> {
        return await axios.post(`https://graph.facebook.com/${whatsApp.VERSION}/${whatsApp.PHONE_NUMBER_ID}/messages`, {
            "messaging_product": "whatsapp",
            "to": message.recepient,
            "type": "template",
            "template": {
                "name": message.template,
                "language": {
                    "code": message.languageCode ? message.languageCode : "en_us"
                },
                "components": [
                    {
                        "type": "header",
                        "parameters": [{ "type": "text", "text": "Sandhya Aqua" }]
                    },
                    {
                        "type": "body",
                        "parameters": message.parameters,

                    }
                ]
            }
        }, {
            "headers": {
                'Authorization': `Bearer ${whatsApp.ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
        }).then((res) => {
            return res.data;
        }).catch(err => { return err });
    }

    async sendMessageWithButtonThroughFbApi(message: MessageParameters): Promise<MessageResponse> {
        return await axios.post(`https://graph.facebook.com/${whatsApp.VERSION}/${whatsApp.PHONE_NUMBER_ID}/messages`, {
            "messaging_product": "whatsapp",
            "to": message.recepient,
            "type": "template",
            "template": {
                "name": message.template,
                "language": {
                    "code": message.languageCode ? message.languageCode : "en_us"
                },
                "components": [
                    // {
                    //     "type": "header",
                    //     "parameters": [{ "type": "text", "text": "Sandhya Aqua" }]
                    // },
                    {
                        "type": "body",
                        "parameters": message.parameters,

                    },
                ]
            }
        }, {
            "headers": {
                'Authorization': `Bearer ${whatsApp.ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
        }).then((res) => {
            return res.data;
        }).catch(err => { return err });
    }

    async sendMessageWithButtonParamsThroughFbApi(message: MessageParameters): Promise<MessageResponse> {
        return await axios.post(`https://graph.facebook.com/${whatsApp.VERSION}/${whatsApp.PHONE_NUMBER_ID}/messages`, {
            "messaging_product": "whatsapp",
            "to": message.recepient,
            "type": "template",
            "template": {
                "name": message.template,
                "language": {
                    "code": message.languageCode ? message.languageCode : "en_us"
                },
                "components": [
                    // {
                    //     "type": "header",
                    //     "parameters": [{ "type": "text", "text": "Sandhya Aqua" }]
                    // },
                    {
                        "type": "body",
                        "parameters": message.parameters,

                    }, 
                    {
                        "type": "button",
                        "sub_type" : "url",
                        "index": "0", 
                        "parameters": [
                            {
                                "type": "text",
                                "text":message.buttonParameter1
                            }
                        ]
                    },
                    {
                        "type": "button",
                        "sub_type" : "url",
                        "index": "1", 
                        "parameters": [
                            {
                                "type": "text",
                                "text":message.buttonParameter2
                            }
                        ]
                    },
                ]
            }
        }, {
            "headers": {
                'Authorization': `Bearer ${whatsApp.ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
        }).then((res) => {
            return res.data;
        }).catch(err => { return err });
    }

    
}