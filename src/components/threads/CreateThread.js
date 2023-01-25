import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { API_URL, makeAuthGetRequest, makeAuthPostRequest } from '../../http/HttpClient';
import './createthread.css';

export function CreateThread(){
    const navigate = useNavigate();
    const [threadName,setThreadName] = useState("My new hook");
    const [categoryOptions,setCategoryOptions] = useState([<option value={"ctr-65j41xdil4o2x3y2"}>t/literallyanything</option>]);
    const [category,setCategory] = useState("ctr-65j41xdil4o2x3y2");
    const [threadDeletion,setThreadDeletion] = useState("86400000");
    const [memberKick,setMemberKick] = useState("900000");
    const [gracePeriod,setGracePeriod] = useState("1800000");

    useEffect(() =>{
        const getAllJoinedCategories = async () =>{
            let res = await makeAuthGetRequest(API_URL +"/api/alpha/categories/joined");
            

            if(res.data.status == "success"){
                let tempCategoryOptions = [];
                let tempCategories = [];
                
                for(var i = 0; i < res.data.categories.length; i++){
                    tempCategories.push(res.data.categories)
                    tempCategoryOptions.push(<option value={res.data.categories[i].id}>t/{res.data.categories[i].name}</option>)
                }

                setCategoryOptions(tempCategoryOptions);
            
            }

        }

        getAllJoinedCategories();
    },[]);

    const createThread = async (e) =>{
        e.preventDefault();
        var thread = await makeAuthPostRequest(API_URL +"/api/alpha/threads/create",{'name':threadName,category,"deletetime":Date.now() + parseInt(threadDeletion),"kickTime":parseInt(memberKick),gracePeriod:parseInt(gracePeriod)});

        if(thread.data.status == "success"){
            navigate("/app/threads");
        }
        
    }

    return (
        <div style={{'marginLeft':"20px","marginTop":"20px"}}>
            <div className='create-thread-content'>
                <form onSubmit={createThread} className='create-thread-form'>
                    <div className='create-thread-center'>
                        <h1 className='create-thread-title'>Create Hook</h1>
                        <p className='create-thread-subtitle'>create a hook for people to join.</p>
                    </div>

                    <div className='create-thread-container'>
                        <p className='create-thread-subtitle'>Hook title</p>
                        <input onChange={(e) =>{setThreadName(e.target.value)}} placeholder='enter hook title...' className='create-thread-input'></input>
                    </div>

                    <div className='create-thread-container'>
                        <p className='create-thread-subtitle'>Hook deletion time</p>
                        <select onChange={(e) =>{setThreadDeletion(e.target.value)}} value={threadDeletion} className='create-thread-select'>
                            <option value="43200000">12 Hours</option>
                            <option value="86400000">24 Hours</option>
                            <option value="172800000">48 Hours</option>
                            
                        </select>
                    </div>

                    <div onChange={(e) =>{setMemberKick(e.target.value)}} style={{'marginTop':"20px"}} className='create-thread-container'>
                        <p className='create-thread-subtitle'>Member kick time</p>
                        <select value={memberKick}className='create-thread-select'>
                        <option value={"600000"}>10 Minutes</option>
                            <option value={"900000"}>15 Minutes</option>
                            <option value="1800000">30 Minutes</option>
                        </select>
                    </div>

                    <div onChange={(e) =>{setGracePeriod(e.target.value)}} style={{'marginTop':"20px"}} className='create-thread-container'>
                        <p className='create-thread-subtitle'>Message Grace Period</p>
                        <select value={gracePeriod}className='create-thread-select'>
                            <option value={"1800000"}>30 Minutes</option>
                            <option value={"2700000"}>45 Minutes</option>
                            <option value="3600000">60 Minutes</option>
                        </select>
                    </div>

                    <div style={{'marginTop':"15px"}} className='create-thread-container'>
                        <p className='create-thread-subtitle'>Category</p>
                        <select onChange={(e) =>{setCategory(e.target.value)}} className='create-thread-select' value={category}>
                        {categoryOptions}
                        </select>
                    </div>
                    <button type="submit"className='create-thread-form-button'>Create hook</button>
                </form>
            </div>
        </div>
    )
}