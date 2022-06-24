import React, { useEffect, useRef, useState } from 'react';
import { API_URL, makeAuthPostRequest } from '../../http/HttpClient';
import './settings.css';

function UpdateProfileView(props){

}

function ProfileAvatar(props){
    var fileRef = useRef(null);

    const [avatar,setAvatar] = useState(props.avatar);
    useEffect(() =>{
        if(props.avatar != avatar){
            setAvatar(props.avatar)
        }
        
    })



    const onFileChange = async (e) =>{
        

        const formData = new FormData();
        formData.append('avatar',e.target.files[0],'avatar')


        var res = await makeAuthPostRequest(API_URL + "/api/v1/users/avatar",formData);

        if(res.data.status == "success"){
            var fr = new FileReader();

            fr.onload = function(){
                setAvatar(fr.result);
            }
    
            fr.readAsDataURL(e.target.files[0]);

            window.location.reload();
        }
    }

    const onAvatarClick = () =>{
        fileRef.current.click()
    }


    return (
        <div className={'avatar-container'}>
           
            <input style={{"display":"none"}}onChange={onFileChange} ref={fileRef} accept={".jpg,.jpeg,.png"} type={"file"}></input>
            <a onClick={onAvatarClick}><img className={'settings-profile-avatar'} src={avatar}></img></a>
        </div>
    )
}


class SettingsProfile extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            avatar:this.props.avatar
        }
    }

    updateProfile(){
        this.props.overlay();
    }

    static getDerivedStateFromProps(props, current_state) {
        console.log("derived",props.avatar)
        return {
            avatar:props.avatar
        }
    }

    render(){
        return (
            <div className={'settings-profile-card-base'}>
                <div className={'settings-profile-card-center'} >

                    <ProfileAvatar avatar={this.state.avatar}></ProfileAvatar>
                    <div className={'settings-profile-text-container'}>
                        <span className={'settings-username-title'}>{this.props.username}</span>
                        <div className={'settings-profile-container'}>
                            <span style={{'color':'white','fontWeight':'600'}}>Email</span>
                            <span className={'settings-profile-title'}>{this.props.email}</span>
                        </div>

                        <div className={'settings-profile-container'}>
                            <span style={{'color':'white','fontWeight':'600'}}>Username</span>
                            <span className={'settings-profile-title'}>{this.props.username}</span>
                        </div>

                        <div className={'settings-profile-container'}>
                            <span style={{'color':'white','fontWeight':'600'}}>Password</span>
                            <span className={'settings-password-title settings-password-text'}>temporary password</span>
                        </div>

                        <div className={'settings-profile-container'}>
                            <span style={{'color':'white','fontWeight':'600'}}>Time spent on App</span>
                            <span className={'settings-profile-title'}>{(this.props.timespent/3600000).toFixed(2)} Hours</span>
                        </div>
                    </div>
                </div>

                <div>
                            {this.props.signout}
                            <button className={'button is-primary profile-button'} onClick={this.updateProfile.bind(this)}>Edit Profile</button>
                           
                    </div>
               
            </div>
        )
    }
}

export default SettingsProfile;