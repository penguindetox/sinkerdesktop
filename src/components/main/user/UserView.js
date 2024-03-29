import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL, makeAuthGetRequest, makeAuthPostRequest } from '../../../http/HttpClient';
import { ChatConnect, ioclient, SendChatInteraction } from '../../../http/IOClient';
import { withRouter } from '../../WithRouter';
import './userview.css';
import './usermessages.css';
import dayjs from 'dayjs';

function UserMessage(props){
    const messageref = useRef(null);
    useEffect(() => {
        if(messageref.current){
            messageref.current.scrollIntoView();
        }
       
      },[]);
    return (
        <div ref={messageref} className={'usermessage-container'}>
            <img className={'usermessage-avatar'} src={props.avatar}></img>
            <div><p className={'usermessage-username'}>{props.username}<span style={{'position':"absolute",color:"white","top":"0","right":"0","marginRight":"25px","fontSize":"1vw","marginTop":"10px"}}>{dayjs(props.timestamp).format("MMM D, YYYY h:mm A")}</span></p>
            <div className={'usermessage-content'}>{props.message}</div></div>
            <br></br>
            

        </div>
    )
}

class UserViewclass extends React.Component{
   constructor(props){
       super(props);
    
       this.state = {
           messages:[],
           messageInput:"",
           user:null,
           from:this.props.params.userid,
           changed:false,
           friend:{'username':"loading...",avatar:""}
       }
   }

   async componentDidMount(){
    var user = await makeAuthGetRequest(API_URL + "/api/alpha/users/user/me").catch(e => false);
    var friend = await makeAuthGetRequest(API_URL + "/api/alpha/users/user/" + this.state.from).catch(e => false);

    if(user.data && friend.data){
        var messages = await makeAuthGetRequest(API_URL +`/api/alpha/messages/get?friend=${friend.data.user.id}`);
        
        var messagesEl = [];
        for(var i = 0; i < messages.data.messages.length; i++){
            if(messages.data.messages[i].to == user.data.user.id){
                messagesEl.push(<UserMessage timestamp={messages.data.messages[i].createdAt} key={i} avatar={friend.data.user.avatar} username={friend.data.user.username} message={messages.data.messages[i].content}></UserMessage>)
            }else{
                messagesEl.push(<UserMessage timestamp={messages.data.messages[i].createdAt} key={i} avatar={user.data.user.avatar} username={user.data.user.username} message={messages.data.messages[i].content}></UserMessage>)
            }
            
        }
        this.setState({'user':user.data.user,'friend':friend.data.user,'messages':messagesEl.reverse()});
        await makeAuthPostRequest(API_URL +`/api/alpha/messages/opened`,{'friend':friend.data.user.id});
    }

    var origin = this;
    ioclient.on('chatinteraction',async (data) =>{
        if(origin.state.user && this.state.user.id != data.from.id){
            origin.onMessage(data);
        }
        

    });
   }

   updateMessage(message){
        makeAuthPostRequest(API_URL +"/api/alpha/messages/read",{messageid:message.messageid});
        this.setState({'messages':[...this.state.messages,(<UserMessage timestamp={message.timestamp} key={this.state.messages.length} avatar={message.from.avatar} username={message.from.username} message={message.content}></UserMessage>)]});
        
   }

   async sendMessage(e){
    e.preventDefault();
        SendChatInteraction(this.state.from,this.state.messageInput);

        this.setState({messageInput:'',messages:[...this.state.messages,(<UserMessage timestamp={Date.now()} key={this.state.messages.length} username={this.state.user.username} avatar={this.state.user.avatar} message={this.state.messageInput}></UserMessage>)]});
   }

   setMessageInput(e){
    this.setState({'messageInput':e.target.value})
   }


   async onMessage(message){
    if(message.to.id == this.state.user.id && message.from.id == this.state.from){
        this.updateMessage(message)
    }
   }

   render(){
    if(this.state.messages.length > 0){
        return (
            <div>
                <div className={'user-header'}>
                    <img src={this.state.friend.avatar} className={"user-header-avatar"}></img>
                    <div className={'user-header-title'}>
                        {this.state.friend.username}
                    </div>

                </div>
                <div style={{'paddingLeft':"20px","marginTop":"15px"}}>
                    <div className={"main-message-content"}>
                        {this.state.messages}
                    </div>

                    <form onSubmit={this.sendMessage.bind(this)} className={'message-form'}>
                        <input value={this.state.messageInput}onChange={this.setMessageInput.bind(this)} className={'message-input'} placeholder={"enter message:"} type={'text'}></input>
                        <button type={"submit"} className={"message-button"}>send</button>
                    </form>
                </div>
            </div>
            

        )
    }else{
        return (
            <div>
                <div className={'user-header'}>
                    <img src={this.state.friend.avatar} className={"user-header-avatar"}></img>
                    <div className={'user-header-title'}>
                        {this.state.friend.username}
                    </div>

                </div>
                <div style={{'paddingLeft':"20px"}}>
                    <div className={'no-content-container'}>
                        <h3>It appears you haven't started your conversation yet. so start now!</h3>
                    </div>

                    <form onSubmit={this.sendMessage.bind(this)} className={'message-form'}>
                        <input value={this.state.messageInput} onChange={this.setMessageInput.bind(this)} className={'message-input'} placeholder={"enter message:"} type={'text'}></input>
                        <button type={"submit"} className={"message-button"}>send</button>
                    </form>
                </div>
            </div>

        )
    }
   }

   async componentDidUpdate(){
    if(this.props.params.userid != this.state.from){
        this.setState({
            messages:[],
            messageInput:"",
            from:this.props.params.userid,
            changed:false,
            friend:{'username':"loading...",avatar:""}
        })
        var friend = await makeAuthGetRequest(API_URL + "/api/alpha/users/user/" + this.props.params.userid).catch(e => false);
        if(friend.data){
            var messages = await makeAuthGetRequest(API_URL +`/api/alpha/messages/get?friend=${friend.data.user.id}`);
        
            var messagesEl = [];
            for(var i = 0; i < messages.data.messages.length; i++){
                if(messages.data.messages[i].to == this.state.user.id){
                    messagesEl.push(<UserMessage timestamp={messages.data.messages[i].createdAt} key={i} avatar={friend.data.user.avatar} username={friend.data.user.username} message={messages.data.messages[i].content}></UserMessage>)
                }else{
                    messagesEl.push(<UserMessage timestamp={messages.data.messages[i].createdAt} key={i} avatar={this.state.user.avatar} username={this.state.user.username} message={messages.data.messages[i].content}></UserMessage>)
                }
                
            }
            this.setState({from:this.props.params.userid,friend:friend.data.user,changed:false,messages:messagesEl.reverse()});
            makeAuthPostRequest(API_URL +`/api/alpha/messages/opened`,{'friend':friend.data.user.id});
        }else{
            this.setState({from:this.props.params.userid,friend:{'username':"loading..."},changed:false,messages:[]});
        }
    }

        
   }

   static getDerivedStateFromProps(props,state){
   
    if(props.params.userid != state.from){

       // return {
       //     from:props.params.userid,
       //     messages:[],
       //     changed:true
       // }

    }

        
    
   }
}

export default withRouter(UserViewclass)

export function UserView(props){
    const {userid} = useParams();
    
    const [from,setFrom] = useState(userid);
    
    const [messages,setMessages] = useState([]);
    const [user,setUser] = useState(null);
    const [messageInput,setMessageInput] = useState("");


    

    useEffect( () =>{
        const updateMessage = (message) =>{
            setMessages([...messages,(<UserMessage key={messages.length} username={message.from.username} message={message.content}></UserMessage>)]);
        }
        const onMessage = async (param,userdata,message) =>{

            if(message.to.id == userdata.data.user.id && message.from.id == param){
                updateMessage(message)
            }
        }
        async function setup(realuserid){
                setMessages([]);
                setFrom(userid);
                var userdata = await makeAuthGetRequest(API_URL + "/api/alpha/users/user/me");
                var realid = realuserid;
                setUser(userdata.data.user);
                ChatConnect();
    
                ioclient.on('chatinteraction',async (data) =>{
                    onMessage(realuserid,userdata,data);

                });
            
            
        }

        if(from != userid){
            setup(userid);
        } 
        
    },[userid,messages]);

    const sendMessage = async (e) =>{
        e.preventDefault();
        SendChatInteraction(userid,messageInput);
        setMessages([...messages,(<UserMessage key={messages.length} username={user.username} message={messageInput}></UserMessage>)]);
    }
    if(messages.length > 0){
        return (
            <div style={{'paddingLeft':"20px"}}>
                {messages}
                <form onSubmit={sendMessage} className={'message-form'}>
                    <input onChange={(e) => {setMessageInput(e.target.value)}} className={'message-input'} placeholder={"enter message..."} type={'text'}></input>
                </form>
            </div>
        )
    }else{
        return (
            <div style={{'paddingLeft':"20px"}}>
                <form onSubmit={sendMessage} className={'message-form'}>
                    <input onChange={(e) => {setMessageInput(e.target.value)}} className={'message-input'} placeholder={"enter message..."} type={'text'}></input>
                </form>
            </div>
        )
    }

}