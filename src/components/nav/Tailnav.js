import React from 'react';
import { withRouter } from '../WithRouter';
import './tailnav.css';
import TailTab from './TailTab';
import {FaFire,FaPooStorm,FaHome,FaChessBoard,FaGlobeAmericas,FaCamera,FaLayerGroup,FaCog,FaGem,FaSearch} from 'react-icons/fa';



class TailNav extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <div className={'header'}>
                  <div className={'header-right'}>
                  <img className={'header-avatar'}src={this.props.avatar} ></img>
                    <h4 className={'header-text'}>{this.props.username}</h4>
                    
                  </div>
                </div>
                <div className={'side-nav'}>
                    <TailTab tooltip={'Home'} icon={<FaHome size={'50px'}></FaHome>} route={'/app/home'}></TailTab>
                    <TailTab tooltip={"Threads"} icon={<FaSearch size={'50px'}></FaSearch>} route={'/app/threads'}></TailTab>
                    <TailTab tooltip={"Settings"} className={'settings-icon'} route={"/app/settings"} icon={<FaCog size={'50px'}></FaCog>}></TailTab>
                </div>
                
            </div>
        )
    }
}

export default withRouter(TailNav);