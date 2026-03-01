// require('dotenv').config();
export interface ConfigTypo {
    APP_WMS_SERVICE_URL: string,
    APP_PKDMS_SERVICE_URL: string,
    APP_GATEX_SERVICE_URL: string,
    APP_IAM_SERVER_URL: string,
    APP_IAM_CLIENT_ID: string,
    APP_WHATSAPP_NOTIFICATION_URL: string,
    APP_WHATSAPP_BROADCAST_URL: string,
    APP_REQ_RETRY_MAX_ATTEMPTS: number,
    APP_REQ_RETRY_STATUS_CODES: string,
    APP_REQ_RETRY_DELAY: number,
    APP_RETRY_CODES: string
}

export const configVariables: ConfigTypo = {
    APP_WMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_WMS_SERVICE_URL'] : process.env['APP_WMS_SERVICE_URL'] || 'https://xpparel-dev-wms.schemaxtech.in',
    APP_PKDMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_PKDMS_SERVICE_URL'] : process.env['APP_PKDMS_SERVICE_URL'] || 'https://xpparel-dev-pkdms.schemaxtech.in',
    APP_GATEX_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_GATEX_SERVICE_URL'] : process.env['APP_GATEX_SERVICE_URL'] || 'https://gatex-be.schemaxtech.in/api',
    APP_IAM_SERVER_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_IAM_SERVER_URL'] : process.env['APP_IAM_SERVER_URL'] || 'https://sq-dev-iam-be.schemaxtech.in',
    APP_IAM_CLIENT_ID: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_IAM_CLIENT_ID'] : process.env['APP_IAM_CLIENT_ID'] || 'https://sq-dev-iam-be.schemaxtech.in',
    APP_WHATSAPP_NOTIFICATION_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_WHATSAPP_NOTIFICATION_URL'] : process.env['APP_WHATSAPP_NOTIFICATION_URL'] || 'https://xpparel-dev-whatsapp.schemaxtech.in',
    APP_WHATSAPP_BROADCAST_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_WHATSAPP_BROADCAST_URL'] : process.env['APP_WHATSAPP_BROADCAST_URL'] || 'https://xpparel-dev-whatsapp.schemaxtech.in',
    APP_REQ_RETRY_MAX_ATTEMPTS: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_REQ_RETRY_MAX_ATTEMPTS'] : process.env['APP_REQ_RETRY_MAX_ATTEMPTS'] || 3,
    APP_REQ_RETRY_STATUS_CODES: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_REQ_RETRY_STATUS_CODES'] : process.env['APP_REQ_RETRY_STATUS_CODES'] || '500,502,503,504',
    APP_REQ_RETRY_DELAY: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_REQ_RETRY_DELAY'] : process.env['APP_REQ_RETRY_DELAY'] || 1000,
    APP_RETRY_CODES: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_RETRY_CODES'] : process.env['APP_RETRY_CODES'] || 'ECONNRESET,ETIMEDOUT'
}
