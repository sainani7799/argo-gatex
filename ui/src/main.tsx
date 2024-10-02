import * as ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import App from './app/app';
import { IntlProvider } from 'react-intl';




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
   
        <App />
  </Router>
);
