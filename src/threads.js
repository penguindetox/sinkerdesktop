import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { Outlet, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { API_URL, makeAuthGetRequest, makeAuthPostRequest } from './http/HttpClient';
import './threads.css';

function ThreadCard(props){
    const [joined,setJoined] = useState(false);
    const [time,setTime] = useState(0);
    const [category,setCategory] = useState({"name":"loading","id":""});
    const navigate = useNavigate();

    useEffect(() =>{

        const getCategory = async () =>{
            var category = await makeAuthGetRequest(API_URL + "/api/v1/threads/categories/category/" + props.thread.categoryid).catch(e =>false);

            if(category){
                setCategory({name:category.data.category.name,id:category.data.category.id});
            }
        }

        if(props.thread && props.thread.members[props.user.id]){
            setJoined(true);
            
        }

        const from = dayjs(props.thread.createdAt);
        const to = dayjs(props.thread.deleteTime);

        setTime(to.diff(from,'hours'));
        getCategory();
    },[])

    const onJoin = async () =>{
        var res = await makeAuthPostRequest(API_URL +"/api/v1/threads/join",{'id':props.thread.id});

        if(res.data.status == "success"){
            navigate("/app/threads/thread/" + props.thread.id);
            props.clicked(true);
        }
    }

    const onView = async () =>{
        navigate("/app/threads/thread/" + props.thread.id);
        props.clicked(true);
    }

    if(joined){
        return (
            <div className={'thread-profile-card-base'}>
                <div style={{'marginBottom':"-30px"}} className={'thread-profile-container'}>
                    <Link style={{'textDecoration':"none"}} to={`/categories/${category.id}`}>
                        <div className='thread-subtitle'>
                            <p>t/{category.name}</p>
                        </div>
                    </Link>

                </div>
                <div className={'thread-profile-container'}>
                    <h3 className={'thread-title'}>{props.thread.name}</h3>
                </div>
                <div className={'thread-profile-container'}>
                    <div style={{'color':"white","display":"inline-flex","marginLeft":"20px",position:"relative"}}>
                        <FaUser size={'20px'}></FaUser><strong>{Object.keys(props.thread.members).length}</strong>
                    </div>
                </div>
                <div className={'thread-profile-container'}>
                    <div style={{'color':"white","display":"inline-flex","marginLeft":"20px",position:"relative"}}>
                        <strong>ends in {time} hours</strong>
                    </div>
                </div>
                <button onClick={onView} className={'thread-profile-button-view'}>View</button>
            </div>
        )
    }else{
        return (
            <div style={{'marginRight':"10px"}} className={'thread-profile-card-base'}>
                <div style={{'marginBottom':"-30px"}} className={'thread-profile-container'}>
                    <Link style={{'textDecoration':"none"}} to={`/categories/${category.id}`}>
                        <div className='thread-subtitle'>
                            <p>t/{category.name}</p>
                        </div>
                    </Link>

                </div>
                <div className={'thread-profile-container'}>
                    <h3 className={'thread-title'}>{props.thread.name}</h3>
                </div>
                <div className={'thread-profile-container'}>
                    <div style={{'color':"white","display":"inline-flex","marginLeft":"20px",position:"relative"}}>
                        <FaUser size={'20px'}></FaUser><strong>{Object.keys(props.thread.members).length}</strong>
                    </div>
                </div>
                <button onClick={onJoin}className={'thread-profile-button'}>Join</button>
            </div>
        )
    }
    
}

function Threads(){
    const [user,setUser] = useState(null);
    const [clicked,setClicked] = useState(false);
    const [newest,setNewest] = useState([]);
    const [userThreads,setUserThreads] = useState([]);
    const navigate = useNavigate();

    useEffect(() =>{
        const getUser = async () =>{
            var user = await makeAuthGetRequest(API_URL +"/api/v1/users/user/me").catch(e => false);

            if(user && user.data.status == "success"){
                setUser(user.data.user);

                return user.data.user;
            }
        }
        const getNewestPosts = async () =>{
            var user = await makeAuthGetRequest(API_URL +"/api/v1/users/user/me").catch(e => false);
            var res = await makeAuthGetRequest(API_URL + "/api/v1/threads/newest").catch(e => false);
            if(res && res.data.status == "success"){
                var threadel = [];
               
                for(var i = 0; i < res.data.threads.length; i++){
                    
                    threadel.push(<ThreadCard clicked={setClicked} user={user.data.user} thread={res.data.threads[i]} />)
                }
                
                setNewest(threadel);
            }
        }

        const getUserThreads = async () =>{
            var user = await makeAuthGetRequest(API_URL +"/api/v1/users/user/me").catch(e => false);
            var joined = await makeAuthGetRequest(API_URL + "/api/v1/threads/joined").catch(e =>false);
            if(joined && joined.data.status == "success"){
                var threadel = [];
               
                for(var i = 0; i < joined.data.threads.length; i++){
                    
                    threadel.push(<ThreadCard clicked={setClicked} user={user.data.user} thread={joined.data.threads[i]} />)
                }

                setUserThreads(threadel);
            }
        }

        getUser();

        getUserThreads();
        getNewestPosts();

    },[]);

    const trueClick = () =>{
        setClicked(true)
    }

    if(!clicked){
        
        return (
            <div style={{'marginLeft':'25px'}}>
                <h1 className='thread-title'>Joined Threads</h1>
                <p className='thread-subtitle'>See all your joined threads here.</p>
                <div className={'thread-row'}>
                 {userThreads.length == 0 ? <></>: userThreads}
                </div>
                <h1 className='thread-title'>Newest Threads</h1>
                <p className='thread-subtitle'>See the newest threads added to ghoulish.</p>
                <div className={'thread-row'}>

                    {newest.length == 0 ? <></>: newest}
                </div>

               
                       <Link to={'/app/threads/create'}><button onClick={trueClick} className={"create-thread-button"}>Create Thread</button></Link> 
            </div>

        )
    }else{
        return (
            <Outlet></Outlet>
        )
    }

}

export default Threads;