import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { API_URL, makeAuthGetRequest } from '../../http/HttpClient';
import { ioclient, SendThreadInteraction } from '../../http/IOClient';
import { withRouter } from '../WithRouter';
import './threadpage.css';

function ThreadMessage(props){
    useEffect(() =>{

    },[]);

    return (
        <div>
            {props.user.username}: {props.content}
        </div>
    )
}

function ThreadMember(props){
    const [member,setMember] = useState({'username':"loading...","avatar":""});
    
    useEffect(() =>{
        const getMember = async () =>{
            var user = await makeAuthGetRequest(API_URL + "/api/v1/users/user/" +props.member.id);

            if(user.data.status == "success"){
                setMember(user.data.user);
            }
        }

        getMember();
    },[]);

    return (
    <div className={'threadmember-container'}>
        <img className={'threadmember-avatar'} src={member.avatar}></img>
        <p className={'threadmember-username'}>{member.username}</p>
        <br></br>
        

        </div>
    )
}

class Thread extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            thread:{'name':"Loading..."},
            memberscard:[],
            members:{},
            user:{},
            messages:[],
            threadmessage:""

        }
    }

    async componentDidMount(){
        var user = await makeAuthGetRequest(API_URL + `/api/v1/users/user/me`);
        var thread = await makeAuthGetRequest(API_URL +`/api/v1/threads/thread/${this.props.params.threadid}`);

        if(thread.data.status == "success" && user.data.status == "success"){
            var memberKeys = Object.keys(thread.data.thread.members);
            var membersEls = [];

            for(var i = 0; i < memberKeys.length; i++){
                if(!thread.data.thread.members[memberKeys[i]].kicked){
                    membersEls.push(<ThreadMember key={i} member={thread.data.thread.members[memberKeys[i]]}></ThreadMember>)
                }
                
            }

            var messageEls = [];
            for(var i = 0; i < thread.data.thread.messages.length; i++){
                messageEls.push(<ThreadMessage content={thread.data.thread.messages[i].content} user={thread.data.thread.messages[i].user} thread={thread.data.thread} key={i}></ThreadMessage>)
            }

            this.setState({'thread':thread.data.thread,members:thread.data.thread.members,memberscard:membersEls,user:user.data.user,messages:[]});

            var origin = this;
            ioclient.on('threadinteraction',async function(data){
                origin.onThreadMessage(data);
            });
        }else{

        }
    }

    async onThreadMessage(data){
        this.setState({'messages':[...this.state.messages,(<ThreadMessage key={this.state.messages.length} content={data.content} user={data.user} thread={this.state.thread} ></ThreadMessage>)]})
    }

    setThreadInput(e){
        this.setState({'threadmessage':e.target.value});
    }

    async submitMessage(){
        SendThreadInteraction(this.props.params.threadid,this.state.threadmessage,2);
    }

    render(){
        return (
            <div style={{'marginTop':"5px"}}>

                <div className={'threadpage-content'}>
                    <p style={{'marginBottom':"-10px",'color':"rgb(166, 166, 166)",fontWeight:"600"}}>id: {this.state.thread.id}</p>
                    <h2 style={{'color':'white','wordWrap':"break-word","marginBottom":"20px","marginLeft":"20px"}}>{this.state.thread.name}</h2>
                    <h3 style={{'color':'white'}}> <FaUser size={'1rem'} style={{'marginRight':"10px"}}></FaUser>Members({Object.keys(this.state.members).length})</h3>
                    {this.state.memberscard}
                </div>

                <div style={{'marginLeft':"20vw"}}>
                {this.state.messages.length == 0 ?(<div>
                        <h3>It appears you haven't started your conversation yet. so start now!</h3>
                    </div>):<div>{this.state.messages}</div>}
                </div>

                
                <form onSubmit={this.submitMessage.bind(this)} className={'message-form'}>
                    <input onChange={this.setThreadInput.bind(this)} className={'message-input'} placeholder={"enter message..."} type={'text'}></input>
                    <button type={"submit"} className={"message-button"}>send</button>
                </form>
            </div>
        )
    }
}

export default withRouter(Thread);