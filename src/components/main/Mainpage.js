import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_URL, makeAuthGetRequest, makeAuthPostRequest } from '../../http/HttpClient';
import { ioclient } from '../../http/IOClient';
import { withRouter } from '../WithRouter';
import { FaUser, FaUserPlus } from 'react-icons/fa';
import './mainpage.css';

function FriendTab(props){
    const curlocation = useLocation();
    const [location,setLocation] = useState(curlocation);

    useEffect(() =>{
        setLocation(curlocation);
    },[curlocation]);
    
    if(location.pathname.includes(`/app/home/${props.friend.id}`)){
        return (
            <Link style={{'textDecoration':"none",color:"white"}} to={`/app/home/${props.friend.id}`}>
                <div className={'profile-card-base-selected'}>
                    <img className={'profile-image'} src={props.friend.avatar}></img>
                    <span className={'profile-text-container'}>
                    
                        <p className={'username-title-selected'}>{props.friend.username}</p>
                    </span>
    
                </div>
            </Link>
    
        )
    }else{
        return (
            <Link style={{'textDecoration':"none",color:"white"}} to={`/app/home/${props.friend.id}`}>
                <div className={'profile-card-base'}>
                    <img className={'profile-image'} src={props.friend.avatar}></img>
                    <span className={'profile-text-container'}>
                    
                        <p className={'username-title'}>{props.friend.username}</p>
                    </span>
    
                </div>
            </Link>
    
        )
    }
    
}

function AddFriendNotification(props){
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

class MainUserPage extends React.Component{
    constructor(props){
        super(props);
        document.title = "Sinker - Home"

        this.state = {
            user:null,
            friends:"loading",
            addfriend:"",
            error:null
        }
    }

    async componentDidMount(){
        var res = await makeAuthGetRequest(API_URL + "/api/alpha/users/user/me");


        if(res.data.status == "success"){
            var userfriends = await makeAuthGetRequest(API_URL + "/api/alpha/users/friends/me/sorted");
            if(userfriends.data.status == "success"){
                var allfriends = [];
                for(var i = 0; i < userfriends.data.friends.length; i++){
                    allfriends.push(<FriendTab friend={userfriends.data.friends[i]} />);
                    
                }
                this.setState({'user':res.data.user,'friends':allfriends});
            }else{
                this.setState({'user':res.data.user,'friends':false});
            }
           
        }
        
    }

    updateAddFriend(e){
        this.setState({'addfriend':e.target.value})
    }

    async addFriend(e){
        e.preventDefault();

        var res = await makeAuthPostRequest(API_URL +"/api/alpha/users/addfriend",{'username':this.state.addfriend});
        if(res.data.status == "success"){
            this.setState({'error':<AddFriendNotification error={false} message={"Successfully sent a friend request!"}></AddFriendNotification>,'addfriend':""})
        }else if(res.data.status == "alreadyfriends"){
            this.setState({'error':<AddFriendNotification error={true} message={"You're already friends with this user."}></AddFriendNotification>,'addfriend':""})
        }else if(res.data.status == "frienddoesntexist"){
            this.setState({'error':<AddFriendNotification error={true} message={"The user you tried to add doesn't exist."}></AddFriendNotification>,'addfriend':""})
        }else if(res.data.status == "alreadyrequested"){
            this.setState({'error':<AddFriendNotification error={true} message={"You already sent a friend request to this user."}></AddFriendNotification>,'addfriend':""})
        }
    }

    render(){
        if(this.state.friends == "loading"){
            return (
                <div style={{'display':'flex',position:'relative'}}>
                    {this.state.error}
                    <div className={"mainpage-content"}>
                        <div>
                            <form onSubmit={this.addFriend.bind(this)} className={'add-user-form'}>
                                <input onChange={this.updateAddFriend.bind(this)}value={this.state.addfriend} className='add-user-input' placeholder="Add people..." ></input>
                                <button type='submit' className='add-user-button'><FaUserPlus size={'20px'}></FaUserPlus></button>
                            </form>
                            
                            </div>
                            <div style={{"fontSize":"30px","fontWeight":"700",'color':"white","display":"flex","alignItems":"center","justifyContent":"center"}}>
                
                                {this.state.friends}
                            </div>
                            
                        </div>
                        <div style={{"marginTop":"10px"}}>
                    
                        {this.props.location.pathname.length != 9 ? this.props.children : (<div className={'no-content-container'}>
                            <h3>Click on a profile to start a conversation, or go and check out the threads!</h3>
                        </div>)}
                    </div>
                    
                </div>
            )
        }else{
            return (
                <div style={{'display':'flex',position:'relative'}}>
                    {this.state.error}
                    <div className={"mainpage-content"}>
                    <div>
                    <form onSubmit={this.addFriend.bind(this)} className={'add-user-form'}>
                            <input value={this.state.addfriend} onChange={this.updateAddFriend.bind(this)} className='add-user-input' placeholder="Add people..." ></input>
                            <button type={'submit'} className='add-user-button'><FaUserPlus size={'20px'}></FaUserPlus></button>
                        </form>
                    </div>
                        {this.state.friends}
                    </div>
                    <div style={{"marginTop":"10px"}}>
                        
                        {this.props.location.pathname.length != 9? this.props.children : (<div style={{'display':"flex","alignItems":"center","justifyContent":"center","position":"relative"}} className={'no-content-container'}>
                        <h3 >Click on a profile to start a conversation, or go and check out the threads!</h3>
                        </div>)}
                        
                    </div>
                    
                </div>
            )
        }
        
    }
}

export default withRouter(MainUserPage);