import * as axios from 'axios';

//export const API_URL = "https://phantomchatapp.herokuapp.com";
export const API_URL = "http://localhost:8080";

export async function makeAuthPostRequest(url,data){
    var item = localStorage.getItem('token');

    if(item){
        
        return axios.default.post(url,data,{'headers':{'authorization':`Bearer ${item}`}}).catch(e =>{
            return e;
        });
    }else{
        return false;
    }
}

export async function makeAuthGetRequest(url){
    var item = localStorage.getItem('token');

    if(item){
        return axios.default.get(url,{'headers':{'authorization':`Bearer ${item}`}}).catch(e =>{
            return e;
        });
    }else{
        return false;
    }
}
