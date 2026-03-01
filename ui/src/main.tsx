import { ConfigProvider, theme } from 'antd';
import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './app/app';
const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
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
    </ConfigProvider >
  </QueryClientProvider>
);
