import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  HashRouter,
  Route,
  Routes,BrowserRouter, Navigate, Router
} from "react-router-dom";
import SignupPage from './components/signup/SignupPage';
import LoginPage from './components/signup/LoginPage';
import  UserView  from './components/main/user/UserView';
import Home from './home';
import Threads from './threads';
import SettingsView from './components/settings/SettingsView';
import ForgotPassword from './components/signup/ForgotPassword';
import Thread from './components/threads/Thread';
import { CreateThread } from './components/threads/CreateThread';
import { FriendPage } from './components/friends/FriendsPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
if(window.api?.electron && !window.api?.isDev){
  root.render(
    <HashRouter>
      <Routes>
        <Route path='/' element={<Navigate to={localStorage.getItem("token") ? "app/home": "signup"} />}></Route>
        <Route path='app' element={<App />}>
          <Route path='home' element={<Home></Home>}>
            <Route path=':userid' element={<UserView></UserView>}></Route>
          </Route>
          <Route path='threads' element={<Threads></Threads>}>
            <Route path='thread'>
              <Route path=':threadid' element={<Thread></Thread>}></Route>
            </Route>
            <Route path='create' element={<CreateThread></CreateThread>}></Route>
          </Route>
          <Route path="settings" element={<SettingsView></SettingsView>}></Route>
          <Route path='friends' element={<FriendPage></FriendPage>}></Route>
        </Route>
        
       
        <Route path='signup' element={<SignupPage />}></Route>
        <Route path='login' element={<LoginPage />}></Route>
        <Route path='resetpassword' element={<ForgotPassword></ForgotPassword>}></Route>
        <Route path='*' element={<Navigate to={localStorage.getItem("token") ? "home": "signup"} />}></Route>
      </Routes>
    </HashRouter>
  );
}else{
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={localStorage.getItem("token") ? "app/home": "signup"} />}></Route>
        <Route path='app' element={<App />}>
          <Route path='home' element={<Home></Home>}>
            <Route path=':userid' element={<UserView></UserView>}></Route>
          </Route>
          <Route path='threads' element={<Threads></Threads>}>
            <Route path='thread'>
              <Route path=':threadid' element={<Thread></Thread>}></Route>
            </Route>
            <Route path='create' element={<CreateThread></CreateThread>}></Route>
          </Route>
          <Route path="settings" element={<SettingsView></SettingsView>}></Route>
          <Route path='friends' element={<FriendPage></FriendPage>}></Route>
        </Route>
        
        <Route path='signup' element={<SignupPage />}></Route>
        <Route path='login' element={<LoginPage />}></Route>
        <Route path='resetpassword' element={<ForgotPassword></ForgotPassword>}></Route>
        <Route path='*' element={<Navigate to={localStorage.getItem("token") ? "app/home": "app/signup"} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
