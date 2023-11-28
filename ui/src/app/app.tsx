import { useState } from 'react';
import './app.module.css';
import NxWelcome from "./nx-welcome";
import axios from 'axios';
import AppRoutes from './app-routes';



export function App() {
  const [load, setLoad] = useState<any>();


  axios.interceptors.request.use(request => {
      setLoad(true);
      return request;
  });

  axios.interceptors.response.use(response => {
      setLoad(false);
      return response;
  }, error => {
      setLoad(false);
      throw error;
  });

  return (
    <>
     <AppRoutes />
    </>);

}


export default App;
