const mailLiveURL = "https://gatex-be.schemaxtech.in/api/mailer";

export const config = {
    APP_DC: "https://gatex-be.schemaxtech.in/api",
    // APP_DC: "http://localhost:3338/api",
    // APP_DC: "http://gpdc.seplcloud.com:3011/api",
    whatsapp_redirection_url: 'http://dev.schemaxtech.in/#',
    whatsapp_notification_url: 'http://206.189.138.212:3000',
    whatsapp_broadcast_url: 'http://206.189.138.212:3232/api',
    APP_ID: 33,
    APP_Name: 'Gate Pass',
    APP_PRO_TICKET_URL: 'https://proticketx-be.schemaxtech.in/api'
}
export const configVariables = {
    ...config
}