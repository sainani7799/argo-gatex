import { useState } from 'react';
import './app.module.css';
import NxWelcome from "./nx-welcome";
import axios from 'axios';
import { ConfigProvider, theme, } from 'antd';
import CustomProLayout from './basic-layout/custom-pro-layout';


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
     
            <CustomProLayout />
        
    );

}


export default App;