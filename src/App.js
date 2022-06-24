import logo from './logo.svg';
import { HashRouter, Outlet } from 'react-router-dom';
import Mainpage from './components/main/Mainpage';
import './app.css';
import { useEffect, useState } from 'react';
import { API_URL, makeAuthGetRequest } from './http/HttpClient';
import Tailnav from './components/nav/Tailnav';
import { ChatConnect, ioclient } from './http/IOClient';

function App(props) {
  const [username,setUsername] = useState("loading...");
  const [avatar,setAvatar] = useState(null);
  useEffect(() =>{
    const setUser = async () =>{
      ChatConnect();
      var user = await makeAuthGetRequest(API_URL +"/api/v1/users/user/me");

      if(user.data){

        
        
        if(Notification.permission == "granted"){
          ioclient.on('chatinteraction',async function(data){
            if(user.data.user.id == data.to.id){
              new Notification(data.from.username,{"body":data.content,"silent":true,"image":data.from.avatar});     
            }
          });
        }else if(Notification.permission !== "denied"){
            var permission = await Notification.requestPermission();
            if(permission == "granted"){
                ioclient.on('chatinteraction',async function(data){
                  if(user.data.user.id == data.to.id){
                    new Notification(data.from.username,{"body":data.content,"silent":true,"image":data.from.avatar});    
                  }
                });
            }
        }
        setUsername(user.data.user.username);
        setAvatar(user.data.user.avatar)
      }
    }

    setUser();

  },[]);
  return (
    
    <div>
      <Tailnav username={username} avatar={avatar}></Tailnav>
      <div className={'home-content'}>
        <Outlet></Outlet>
      </div>
      
      
    </div>
  );
}

export default App;
