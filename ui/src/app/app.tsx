import { ConfigProvider, ThemeConfig, theme } from 'antd';
import en_US from 'antd/es/locale/en_US';
import { useEffect, useState } from 'react';
import './main.css';
import { LoginComponent, useIAMClientState } from './common';
import { AxiosInstance } from 'libs/shared-services/src/axios-instance';
import CustomProLayout from './basic-layout/custom-pro-layout';



function App() {
  const { IAMClientAuthContext, dispatch } = useIAMClientState();
  let counter = 0;
  const [load, setLoad] = useState(false);
  useEffect(() => {
    localStorage.setItem('role', '"ADMIN"');
  }, []);
  

  const light: ThemeConfig = {
    algorithm: [theme.compactAlgorithm],
    token: {
      wireframe: false,
      borderRadius: 0,
      colorPrimary: "#2c8bb1",//#1976d2
      fontFamily: `'Nunito', 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue','sans-serif'`,
    },
    components: {
      Table: {
        headerBg: '#0086ac',//'#0db1b1',
        headerColor: '#ffffff'
      },
      Collapse: {
        headerBg: '#0096c1',
        colorTextHeading: '#fff'
      }
    }
  }

  AxiosInstance.interceptors.request.use(request => {
    counter++;
    if (!request['loadStatus']) {
      setLoad(true);
    }
    return request;
  });

  AxiosInstance.interceptors.response.use(response => {
    counter--;
    if (counter == 0) {
      setLoad(false);
    }
    return response;
  }, error => {
    counter--;
    if (counter == 0)
      setLoad(false);
    throw error;
  })

  return (
     IAMClientAuthContext.isAuthenticated ? 
  <ConfigProvider theme={light} locale={en_US}>
    {/* <LoadingSpinner loading={load} /> */}
    <div className="App">
      <CustomProLayout key="1" />
    </div>
  </ConfigProvider>
   :
    <div >
    <LoginComponent />
  </div>
  );
}

export default App;


