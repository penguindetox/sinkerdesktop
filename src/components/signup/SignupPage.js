import React,{useState} from 'react';
import './login.css';
import axios from 'axios';
import { API_URL } from '../../http/HttpClient';
import { Link } from 'react-router-dom';
import { withRouter } from '../WithRouter';
import { useNavigate } from 'react-router-dom';

export function NotificationError(props){
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

export function LoadingNotification(props){
    

    return (
        <div className={'notification-loading'}>
           
            <strong>Loading into the app...</strong>
        </div>
    )
}

export class SignupPage extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            username:null,
            email:null,
            password:null,
            error:false,
            success:false,
            loading:false
        }
    }

    async submitSignup(e){
        e.preventDefault();

        this.setState({'loading':true,'error':false});
        if(this.state.username && this.state.email && this.state.password){
            var res = await axios.post(API_URL + "/api/v1/users/create",{username:this.state.username,email:this.state.email,password:this.state.password}).catch(e => false);
            
            if(res.data.status == "success"){
                localStorage.setItem('token',res.data.token);

                this.setState({'success':true,'loading':false});

                this.props.navigate('/app/home');
            }else{
                if(res.data){
                    this.setState({'loading':false,error:res.data.status});
                }else{
                    this.setState({'loading':false,error:"axioserror"});
                }
                
            }
        }else{
            
        }
        

    }

    onChangeError(){
        this.setState({'error':false});
    }

    onChangeEmail(e){
        this.setState({'email':e.target.value})
    }

    onChangeUsername(e){
        this.setState({'username':e.target.value});
    }

    onChangePassword(e){
        this.setState({'password':e.target.value});
    }



    render(){
        return (
            
            <div style={{'display':'flex','alignItems':'center','justifyContent':'center'}}>
                {this.state.loading ? <LoadingNotification></LoadingNotification> : <></>}
                {!this.state.error ? <></> : <>{this.state.error == "emailtaken" ? <NotificationError errorFunc={this.onChangeError.bind(this)} content={"The email you entered is unavailable or has already been taken"} /> :<NotificationError errorFunc={this.onChangeError.bind(this)} content={"The username you entered is unavailable or has already been taken"}></NotificationError>}</>}
                <form style={{'padding':'10px'}} onSubmit={this.submitSignup.bind(this)}>
                    <h1 className={"form-title"}>Phantom - A truely secure messaging platform</h1>
                    <label className={"amptextcolour"} htmlFor={"email"}><b>Email</b></label>
                    <p className={'control has-icons-left'}>
                        <input className={"login-input"} type="text" value={this.state.email} onChange={this.onChangeEmail.bind(this)} placeholder="Enter Email" name="email" required />
                    </p>
                    <label className={"amptextcolour font-bold"}><b>Username</b></label>
                    <p className={'control has-icons-left'}>
                        <input className={"login-input"} placeholder="Enter Username" value={this.state.username} onChange={this.onChangeUsername.bind(this)} name="username" required />
                    </p>
                   
                    <label className={"amptextcolour font-bold"}><b>Password</b></label>
                    <p className={'control has-icons-left'}>
                    <input className={"login-input"} value={this.state.password} onChange={this.onChangePassword.bind(this)} placeholder="Enter password" name="psw" type={"password"} required />
                    </p>

                    <Link style={{'color':'white','textDecoration':'none'}} to={'/login'}>sign in instead<br></br><br></br></Link>
  
                    
                    <button className={"signup-button"} type="submit" >
                        Sign up
                    </button>
                </form>
            </div>
        )
    }
}

export default withRouter(SignupPage);