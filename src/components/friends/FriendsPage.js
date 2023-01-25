import React, { useEffect, useState } from 'react';
import { API_URL, makeAuthGetRequest, makeAuthPostRequest } from '../../http/HttpClient';
import './friends.css';

function AcceptFriendNotification(props){
    const [notifButton,setNotifButton] = useState({'display':"block"});
    const hideNotifButton = () =>{
        setNotifButton({'display':"none"})
    }

    return (
        <div style={notifButton} className={props.error ? 'notification-error':'notification-success'}>
             <span className={"closebtn"} onClick={hideNotifButton}>&times;</span>
            <strong>{props.message}</strong>
        </div>
    )
}

function FriendRequest(props){
    const [notif,setNotif] = useState(null);
    const [success,setSuccess] = useState(false);

    const acceptFriendRequest = async () =>{
        var res = await makeAuthPostRequest(API_URL +"/api/alpha/users/acceptfriend",{'friendid':props.id});

        if(res.data.status == "success"){
            setNotif(<AcceptFriendNotification error={false} message={"Successfully accepted friend request!"}></AcceptFriendNotification>);
            setSuccess(true);
        }
    }
    if(!success){
        return (
            <div className={'friend-request-container'}>
                {notif}
                <div className={'friend-inline'}>
                    <img className={'friend-request-avatar'} src={props.avatar}></img>
                    <h3 className='friend-request-title'>{props.username}</h3>
                    <button onClick={acceptFriendRequest} className='friend-request-button'>Accept</button>
                </div>
            </div>
        )
    }else{
        return notif;
    }

}

export function FriendPage(props){
    document.title = "Sinker - Friends"
    const [requests,setRequests] = useState([]);
    
    useEffect(() =>{
        const getPendingFriends = async () =>{
            var res = await makeAuthGetRequest(API_URL +"/api/alpha/users/pendingfriends");
            var pendingFriends = [];

            if(res.data.status == "success"){
                for(var i = 0; i < res.data.pending.length; i++){
                    pendingFriends.push(<FriendRequest username={res.data.pending[i].username} avatar={res.data.pending[i].avatar} id={res.data.pending[i].id}></FriendRequest>)
                }

                setRequests(pendingFriends);
            }
        }
        

        getPendingFriends();
    },[]);
    
    return (
        <div className='friend-container'>
            
            <div className='addfriendcolumn'>
                <h1 className={'thread-title'}>Accept friend requests</h1>
                <p className='thread-subtitle'>Accept friend requests here.</p>

                {requests.length == 0 ? <h3 style={{'color':"white","marginLeft":"20px"}}>You currently have no friend requests.</h3>: requests}
            </div>
                
        </div>
    )
}