import * as ReactDOM from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import App from './app/app';
import { TicketRaiser } from './app/common';
import { configVariables } from 'libs/shared-services';
const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const applicationId = configVariables.APP_ID;
const proTicketUrl = configVariables.APP_PRO_TICKET_URL;
const applicationName = configVariables.APP_Name;

root.render(
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
      locale={{ locale: 'en-US' }}
      theme={{
        algorithm: theme.compactAlgorithm,
        token: {
          colorPrimary: '#047595',
          borderRadius: 5,
        }
      }}
    >
      <App />
      <TicketRaiser appClientId={applicationId} apiEndpoint={proTicketUrl} applicationName={applicationName}/>
    </ConfigProvider >
  </QueryClientProvider>
);
