import AppRoutes from './app-routes';
import './app.module.css';


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


  return (
    <AppRoutes />
  );

}


export default App;