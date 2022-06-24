import * as io from 'socket.io-client';

export var ioclient = null;

export const INTERACTION_TYPE = {
    CHAT:0,
    SLASHCOMMAND:1
}

export async function ChatConnect(){
    //wss://phantomchatapp.herokuapp.com/
    //ws://localhost:8080/
    ioclient = io.connect("ws://localhost:8080/",{'path':"/interaction/",'query':{token:localStorage.getItem('token'),},transports: [ "websocket" ]});
}

export async function SendChatInteraction(userid,message){
    ioclient.emit('interaction',JSON.stringify({'userid':userid,payload:{'content':message,'type':0},'type':INTERACTION_TYPE.CHAT}));
}

export async function SendThreadInteraction(threadid,message,interactiontype){
    ioclient.emit('interaction',JSON.stringify({type:2,payload:{content:message,type:interactiontype,threadid}}))
}

