import logo from './logo.svg';
import { HashRouter, Outlet } from 'react-router-dom';
import Mainpage from './components/main/Mainpage';
import './app.css';
import { useEffect, useState } from 'react';
import { API_URL, makeAuthGetRequest } from './http/HttpClient';
import Tailnav from './components/nav/Tailnav';
import { ChatConnect, ioclient, SendThreadUpdate } from './http/IOClient';

function App(props) {
  const [username,setUsername] = useState("loading...");
  const [avatar,setAvatar] = useState(null);
  useEffect(() =>{
    const setUser = async () =>{
      ChatConnect();
      var user = await makeAuthGetRequest(API_URL +"/api/alpha/users/user/me");

      if(user.data){
        
        if(Notification.permission == "granted"){
          ioclient.on('chatinteraction',async function(data){
            if(user.data.user.id == data.to.id){
              new Notification(data.from.username,{"body":"sent a message","silent":true,"image":data.from.avatar});     
            }
          });

          ioclient.on('threadinteraction',async function(data){
            if(data.type == 0 && user.data.user.id != data.userid){
              for(var i = 0; i < user.data.user.joined.length; i++){
                if(user.data.user.joined[i].threadid == data.thread.id){
                  new Notification(`User opened a thread`,{'body':`a user opened a thread that you're in!`,"silent":true});
                }
              }
            }

            if(data.type == 2){
              for(var i = 0; i < user.data.user.joined.length; i++){
                if(user.data.user.joined[i].threadid == data.threadid){
                  new Notification(`New message from Thread`,{'body':`${data.user.username} sent a message`,"silent":true});
                }
              }
            }

          });
        }else if(Notification.permission !== "denied"){
            var permission = await Notification.requestPermission();
            if(permission == "granted"){
                ioclient.on('chatinteraction',async function(data){
                  if(user.data.user.id == data.to.id){
                    new Notification(data.from.username,{"body":"sent a message","silent":true,"image":data.from.avatar});    
                  }
                });

                ioclient.on('threadinteraction',async function(data){
                  for(var i = 0; i < user.data.joined.length; i++){
                    if(user.data.joined[i].threadid == data.threadid){
                      new Notification(`New message from Thread`,{'body':`${data.user.username} sent a message`});
                    }
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
