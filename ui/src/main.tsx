import * as ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import App from './app/app';
import { NotificationProvider } from './app/components/common';
import { IAMClientProvider } from './app/common';
import { IntlProvider } from 'react-intl';
import { flattenMessages } from '../src/app/common/utils/utils';



const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);

export const enPmsLabels = {

}


export const messages = {
  en: enPmsLabels
};
export const language = navigator.language.split(/[-_]/)[0];

root.render(
  <Router>
      {/* <IAMClientProvider authServerUrl={authServerUrl} clientId={clientId} unitId={unitId}> */}
      <IntlProvider locale={language} messages={flattenMessages(messages[language])}>
        <App />
        </IntlProvider>
      {/* </IAMClientProvider> */}
  </Router>
);
