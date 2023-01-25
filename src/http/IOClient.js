import * as io from 'socket.io-client';

export var ioclient = null;

export const INTERACTION_TYPE = {
    CHAT:0,
    SLASHCOMMAND:1,
    THREAD_CHAT:2,
    IMAGE_THREAD:3,
    VIDEO_THREAD:4,
    KICK_MEMBER:5,
    UNBAN_MEMBER:6
}

export async function ChatConnect(){
    //wss://phantomchatapp.herokuapp.com/
    //ws://localhost:8080/
    ioclient = io.connect("wss://phantomchatapp.herokuapp.com/",{'path':"/interaction/alpha/",'query':{token:localStorage.getItem('token'),},transports: [ "websocket" ]});
}

export async function SendChatInteraction(userid,message){
    ioclient.emit('interaction',JSON.stringify({'userid':userid,payload:{'content':message,'type':0},'type':INTERACTION_TYPE.CHAT}));
}

export async function SendThreadImageInteraction(userid,photo){
    ioclient.emit('interaction',JSON.stringify({'userid':userid,payload:{'content':photo,'type':0},'type':INTERACTION_TYPE.IMAGE_THREAD}));
}

export async function SendOpenChatInteraction(userid){
    ioclient.emit('interaction',JSON.stringify({userid,payload:{'type':3},'type':INTERACTION_TYPE.CHAT}))
}

export async function SendThreadInteraction(threadid,message,interactiontype){
    ioclient.emit('interaction',JSON.stringify({type:INTERACTION_TYPE.THREAD_CHAT,payload:{content:message,type:interactiontype,threadid}}))
}

export async function SendThreadUpdate(userid){
    ioclient.emit('threadupdate',JSON.stringify({'userid':userid}));
}
