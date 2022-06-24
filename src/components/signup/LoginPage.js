import React,{useState} from 'react';
import './login.css';
import { withRouter } from '../WithRouter';
import {Link} from 'react-router-dom';
import { API_URL } from '../../http/HttpClient';
import axios from 'axios';

function NotificationError(props){
    const [notifbutton,setNotifButton] = useState({'display':'block'});

    const hideNotifButton = () =>{
        props.errorFunc();
    }
    return (
        <div style={notifbutton} className={'notification-error'}>
             <span className={"closebtn"} onClick={hideNotifButton}>&times;</span>
            <strong>{props.content}</strong>
        </div>
    )
}

function LoadingNotification(props){
    

    return (
        <div className={'notification-loading'}>
           
           <strong>Loading into the app...</strong>
        </div>
    )
}

export class LoginPage extends React.Component{
    constructor(props){
        super(props);

        this.state ={
            login:null,
            password:null,
            showSignup:false,
            success:false,
            loading:false,
            error:false
        }
    }

    onChangeLogin(e){
        this.setState({login:e.target.value});
    }

    onChangePassword(e){
        this.setState({'password':e.target.value});
    }

    handleShowSignup(){
        this.setState({'showSignup':true});
    }

    onChangeError(){
        this.setState({'error':false});
    }

    async submitLogin(e){
        e.preventDefault();
        this.setState({'error':false,loading:true});

        var res = await axios.default.post(API_URL + '/api/v1/users/login',{login:this.state.login,password:this.state.password});

        if(res.data.status == "success"){
            localStorage.setItem('token',res.data.token);

            this.setState({'loading':false,'success':true});

            this.props.navigate('/app/home');
        }else{
            this.setState({'loading':false,'error':res.data.status});
        }
    }

    render(){
        return (
            <div>
                {this.state.loading ? <LoadingNotification></LoadingNotification> : <></>}
                {!this.state.error ? <></> : <>{this.state.error == "emailnotused" ? <NotificationError errorFunc={this.onChangeError.bind(this)} content={"The email or username you entered is unavilable or has not been used yet."} /> :<NotificationError errorFunc={this.onChangeError.bind(this)} content={"The password that you entered is incorrect."}></NotificationError>}</>}
                <div className={"signup-section beta-background"}>
                    <form style={{'padding':'10px'}} onSubmit={this.submitLogin.bind(this)}>
                        <h1 className={"form-title"}>Sign into Phantom.</h1>
                        <label className={"amptextcolour font-bold"}><b>Email or username</b></label>
                        <p className={'control has-icons-left'}>
                            <input className={"login-input"} type="text" value={this.state.loginn} onChange={this.onChangeLogin.bind(this)} placeholder="Enter Email or Username" required /> 
      
                        </p>
                       
                        <label className={"amptextcolour font-bold"}><b>Password</b></label>
                        <p className={'control has-icons-left'}>
                        <input className={"login-input"} value={this.state.password} onChange={this.onChangePassword.bind(this)} placeholder="Enter password" name="psw" type={"password"} required />
                        </p>
    
                        <Link style={{'color':'white','textDecoration':'none'}} to={'/signup'}>sign up instead.<br></br><br></br></Link>
                        <Link to={'/resetpassword'} style={{'color':'white','textDecoration':'none'}} className={'btn btn-link text-white form-small-text'}>forgot password?</Link>
                        <button className={"signup-button"} type="submit" >
                            Login
                        </button>
                    </form>
                </div>
            </div>
            
        )
    }
}

export default withRouter(LoginPage);