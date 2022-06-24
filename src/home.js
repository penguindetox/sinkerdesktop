import logo from './logo.svg';
import { HashRouter, Outlet } from 'react-router-dom';
import Mainpage from './components/main/Mainpage';
import './app.css';
import { useEffect, useState } from 'react';
import { API_URL, makeAuthGetRequest } from './http/HttpClient';
import Tailnav from './components/nav/Tailnav';

function Home(props) {
  return (
    
    <div>
      
      <Mainpage><Outlet></Outlet></Mainpage>
      
      
    </div>
  );
}

export default Home;
