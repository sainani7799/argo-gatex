import {config} from '../../../shared-services/config';
const envType = 'DEV';//EnvVarEnum[process.env.NX_ENVIRONMENT.toLocaleUpperCase()];
// const url = process.env[`NX_PMS_` + envType + `_SERVICE_URL`];
const url=config.whatsapp_notification_url;
//'http://206.189.138.212:4000/erpx';

//  const url='http://localhost:4000/erpx';
export const connection = {
    'DEPLOY_URL': url,
    // 'userid':JSON.parse(localStorage.getItem('userid')),
    // 'role':JSON.parse(localStorage.getItem('role'))
}

export default connection;