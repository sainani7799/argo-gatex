import { configVariables } from 'libs/shared-services';
import { useEffect } from 'react';
import AppRoutes from './app-routes';
import './app.module.css';

const applicationId = configVariables.APP_ID;
const proTicketUrl = configVariables.APP_PRO_TICKET_URL;
const applicationName = configVariables.APP_Name;

export function App() {

    const colors = {
        darkMode: {
            primaryColor: '#ba8b06',
            secondaryColor: "#b5b1a5"
        },
        dayMode: {
            primaryColor: 'orange',
            secondaryColor: "#706b5d"
        }
    }
    useEffect(() => {
        const script = document.createElement('script');
        const windowLocal:any=window
      
        script.src = `${proTicketUrl}?appClientId=${applicationId}&&applicationName='${applicationName}'`;
      
        document.body.appendChild(script);
        script.onload = () => {
          console.log('Script loaded successfully');
          if (typeof windowLocal.initializeTicketingTool === 'function') {
            windowLocal.initializeTicketingTool();
          }
        };
      
        return () => {
          document.body.removeChild(script);
        }
      }, []);



    return (
     
            <AppRoutes />
        
    );

}


export default App;