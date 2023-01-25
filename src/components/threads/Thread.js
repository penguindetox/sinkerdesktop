import dayjs from 'dayjs';
import React, { useEffect, useState,useRef } from 'react';
import { FaStopwatch, FaUser } from 'react-icons/fa';
import { API_URL, makeAuthGetRequest } from '../../http/HttpClient';
import { ioclient, SendThreadInteraction } from '../../http/IOClient';
import { withRouter } from '../WithRouter';
import './threadpage.css';
import InfiniteScroll from 'react-infinite-scroller';

function ThreadMessage(props){
    useEffect(() =>{

    },[]);

    const messageref = useRef(null);
    useEffect(() => {
        if(messageref.current && props.snap){
            messageref.current.scrollIntoView();
        }
       
      },[]);
    return (
        <div ref={messageref} className={'usermessage-container'}>
            <img className={'usermessage-avatar'} src={props.user.avatar}></img>
            <div><p className={'usermessage-username'}>{props.user.username} <span style={{'position':"absolute",color:"white","top":"0","right":"0","marginRight":"25px","fontSize":"1vw","marginTop":"10px"}}>{dayjs(props.timestamp).format("MMM D, YYYY h:mm A")}</span></p>
                <div className={'usermessage-content'}>{props.content}</div>
            </div>
            <br></br>
            

        </div>
    )
}

function ThreadMember(props){
    const [member,setMember] = useState({'username':"loading...","avatar":""});
    
    useEffect(() =>{
        const getMember = async () =>{
            var user = await makeAuthGetRequest(API_URL + "/api/alpha/users/user/" +props.member.id);

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
            kicked:false,
            memberscard:[],
            members:{},
            user:{},
            messages:[],
            threadmessage:"",
            currenttime:"",
            lastMessage:0,
            usermessageInterval:null,
            threadEndInterval:null,
            curTimestamp:Date.now(),
            hasMore:true,
            page:0
        }

        this.mainmessageRef = React.createRef();
    }

    calculateTimeLeft(){
        var timelefint = this.state.thread.kicktime - (Date.now() - this.state.lastMessage)
        var hours = Math.floor((timelefint % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes =  Math.floor((timelefint % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timelefint % (1000 * 60)) / 1000);

        this.setState({'currenttime':`${hours} :${minutes >= 10 ? minutes : "0" + `${minutes}`}:${seconds >= 10 ? seconds: "0" + `${seconds}`}`})
    }

    calculateThreadTimeLeft(){

    }

    async componentDidMount(){
        var user = await makeAuthGetRequest(API_URL + `/api/alpha/users/user/me`);
        var thread = await makeAuthGetRequest(API_URL +`/api/alpha/threads/thread/${this.props.params.threadid}`);

        if(thread.data.status == "success" && user.data.status == "success"){
            document.title = thread.data.thread.name;
            await SendThreadInteraction(thread.data.thread.id,"join-thread",0);
            var origin = this;
            var kicked = false;
            ioclient.on('threadinteraction',async function(data){
                if(data.type == 0 && data.kicked == true){
                    origin.setState({'kicked':true});
                    kicked = true;
                }
            });
            var origin = this;

            if(kicked){
                return;
            }

            var memberKeys = Object.keys(thread.data.thread.members);
            var membersEls = [];
            

            for(var i = 0; i < memberKeys.length; i++){
                if(thread.data.thread.members[memberKeys[i]].lastopened <= thread.data.thread.members[memberKeys[i]].graceEnds || thread.data.thread.members[memberKeys[i]].messageStart + thread.data.thread.members[memberKeys[i]].kicktime > Date.now() || thread.data.thread.members[memberKeys[i]].owner){
                    
                    membersEls.push(<ThreadMember key={i} member={thread.data.thread.members[memberKeys[i]]}></ThreadMember>)
                }
                
            }

            var origin = this;
            ioclient.on('threadinteraction',async function(data){
                origin.onThreadMessage(data);
            });
            var currenttime = "∞"
            if(thread.data.thread.members[user.data.user.id].owner == false){
                var timeleft = this.state.lastMessage != 0 ? thread.data.thread.kicktime - (Date.now() - this.state.lastMessage): thread.data.thread.kicktime - (Date.now() - thread.data.thread.members[user.data.user.id]) 
                var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes =  Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);    
    
                currenttime = `${hours} :${minutes}:${seconds}`;
                setInterval(this.calculateTimeLeft.bind(this),1001)
                
            }

            //this.setInitalMessages(thread.data.thread);

            this.setState({lastMessage:thread.data.thread.members[user.data.user.id].lastmessage,'currenttime':currenttime,'thread':thread.data.thread,members:thread.data.thread.members,memberscard:membersEls,user:user.data.user});
            
            
           
           
        }else{
            this.setState({'kicked':true});
        }
    }

    async setInitalMessages(thread){
        var res = await makeAuthGetRequest(API_URL +`/api/alpha/messages/getthread?threadid=${thread.id}&createdAt=${this.state.curTimestamp}&page=${this.state.page}`)
        console.log(res.data)
        var messageEls = [];
        var messageData = res.data.messages.reverse();


        for(var i = 0; i < messageData.length; i++){
            if(i == messageData.length - 1){
                messageEls.push(<ThreadMessage snap={true} timestamp={messageData[i].createdAt} content={messageData[i].content} user={messageData[i].user} thread={thread}></ThreadMessage>)
            }else{
                messageEls.push(<ThreadMessage snap={false} timestamp={messageData[i].createdAt} content={messageData[i].content} user={messageData[i].user} thread={thread}></ThreadMessage>)
            }
            
        }

        if(messageData.length != 0){
            this.setState({'loaded':true,'messages':messageEls,'curTimestamp':messageData[0].createdAt,'page':this.state.page + 1});
        }

        
    }

    async onThreadMessage(data){
        if(data.type == 2 && this.state.thread.id == data.threadid && data.ignore == false){
            this.setState({'messages':[...this.state.messages,(<ThreadMessage timestamp={data.timestamp} content={data.content} user={data.user} thread={this.state.thread} snap={true} ></ThreadMessage>)]})
        }
        
    }

    setThreadInput(e){
        this.setState({'threadmessage':e.target.value});
    }

    async submitMessage(e){
        e.preventDefault();
        
        SendThreadInteraction(this.props.params.threadid,this.state.threadmessage,2);
        this.setState({'threadmessage':"",'messages':[...this.state.messages,(<ThreadMessage timestamp={Date.now()} snap={true} content={this.state.threadmessage} user={this.state.user} thread={this.state.thread}></ThreadMessage>)],lastMessage:Date.now()})
        
    }

    async LoadMoreMessages(){
        
        var res = await makeAuthGetRequest(API_URL +`/api/alpha/messages/getthread?threadid=${this.state.thread.id}&createdAt=${this.state.curTimestamp}&page=${this.state.page}`);
        console.log(res.data)
        if(res.data.messages == 0){
            this.setState({'hasMore':false})
            return;
        }

        if(res.data.status == "success" && res.data.messages.reverse()[0].createdAt != this.state.curTimestamp){
            var allmessages = [];
            var messagedata = res.data.messages;

            for(var i = 0; i < messagedata.length;i++){
                allmessages.push(<ThreadMessage timestamp={res.data.messages[i].createdAt} content={messagedata[i].content} user={messagedata[i].user} thread={this.state.thread}></ThreadMessage>)
            }

            if(messagedata.length != 0){
                this.setState({'messages':[...allmessages,this.state.messages],curTimestamp:messagedata[0].createdAt,page:this.state.page + 1})
            }else{
                
            }
            
        }
    }

    render(){
        if(!this.state.kicked){
            return (
                <div style={{"display":"flex","position":"relative"}}>
                    <div>
                        <div className={'threadpage-content'}>
                            <p style={{'marginBottom':"-10px",'color':"rgb(166, 166, 166)",fontWeight:"600"}}>id: {this.state.thread.id}</p>
                            <h2 style={{'color':'white','wordWrap':"break-word","marginBottom":"20px","marginLeft":"20px"}}>{this.state.thread.name}</h2>
                            <h3 style={{'color':'white'}}> <FaUser size={'1rem'} style={{'marginRight':"10px"}}></FaUser>Members({Object.keys(this.state.members).length})</h3>
                            {this.state.memberscard}
                        </div>
                    </div>
    
    
                    
                   
                    
                        {this.state.thread.id ? <div className={"main-message-content"} ref={this.mainmessageRef} style={{'marginLeft':"20px","marginTop":"20px"}}><InfiniteScroll threshold={50} hasMore={this.state.hasMore} useWindow={false} getScrollParent={() => this.mainmessageRef.current} loadMore={this.LoadMoreMessages.bind(this)} isReverse={true} pageStart={0}>{this.state.messages}</InfiniteScroll></div> : <></>}
                    
                    <form onSubmit={this.submitMessage.bind(this)} className={'message-form'}>
                        <div style={{'marginRight':"20px",color:"white"}}>
                            <FaStopwatch style={{'marginRight':"5px"}} size={"20px"}></FaStopwatch>
                            {this.state.currenttime}
                        </div>
                        <input value={this.state.threadmessage} onChange={this.setThreadInput.bind(this)} className={'message-input'} placeholder={"enter message..."} type={'text'}></input>
                        <button type={"submit"} className={"message-button"}>send</button>
                    </form>
                </div>
            )
        }else{
            return (
                <div>
                    you've been kicked
                </div>
            )
        }
        
    }
}

/*

*/

export default withRouter(Thread);