import { useState } from 'react';
import './app.module.css';
import NxWelcome from "./nx-welcome";
import axios from 'axios';
import AppRoutes from './app-routes';



export function App() {
  const [load, setLoad] = useState<any>();

 let act =0
  axios.interceptors.request.use(request => {
    // act++
      setLoad(true);
      return request;
  });

  axios.interceptors.response.use(response => {
    act--
    if (act == 0){
        setLoad(false);
    }
      return response;
  }, error => {
    // act--
    if (act == 0){
        setLoad(false);
    }
      throw error;
  });

  return (
    <>
     <AppRoutes />
    </>);

}


export default App;
