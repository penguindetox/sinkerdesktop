import React from 'react';
import { API_URL, makeAuthGetRequest } from '../../http/HttpClient';
import { withRouter } from '../WithRouter';
import './settings.css';
import SettingsProfile from './SettingsProfile';


class SettingsView extends React.Component{
    constructor(props){
        super(props);
        document.title = "Sinker - Settings"

        this.state = {
            username:"loading...",
            email:"loading...",
            avatar:"",
            timespent:0,
            overlay:false
        }
    }

    async componentDidMount(){
        var res = await makeAuthGetRequest(API_URL + "/api/alpha/users/user/me").catch(e => {return false});

        if(res.data.status == "success"){
            if(res.data.user.avatar){
                if(res.data.user.timespent){
                    this.setState({'username':res.data.user.username,'email':res.data.user.email,'avatar': res.data.user.avatar,'timespent':res.data.user.timespent});
                }else{
                    this.setState({'username':res.data.user.username,'email':res.data.user.email,'avatar': res.data.user.avatar});
                }
                
            }
            
        }
    }

    toggleOverlay(){
        this.setState({'overlay':!this.state.overlay})
    }

    signout(){
        localStorage.removeItem('token');

        this.props.navigate('/signup');
    }

    render(){
        return (
            <div>
                <SettingsProfile overlay={this.toggleOverlay.bind(this)} timespent={this.state.timespent} signout={<button className={'settings-profile-button'} onClick={this.signout.bind(this)}>Sign out</button>} avatar={this.state.avatar} email={this.state.email} username={this.state.username}></SettingsProfile>
            </div>
        )
    }
}

export default withRouter(SettingsView);