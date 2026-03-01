import { configVariables } from '../../../shared-services/config';
const url = configVariables.APP_WHATSAPP_NOTIFICATION_URL;
export const connection = {
    'DEPLOY_URL': url
}

export default connection;