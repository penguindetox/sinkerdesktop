import { Link } from "react-router-dom";
import { withRouter } from "../WithRouter";
import './tailnav.css';
import React from 'react';
class TailTab extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            selectedval:this.props.selectedval
        }
    }

    render(){
        if(this.props.brand){
            return (
            <div>
                <div className={'tailbox ' + this.props.className} style={{'background':'#2b2b2b'}}>
                    <div className={'tailtab'}>
                        {this.props.icon}
                    </div>
                </div>
            </div>
            )
        }

        if(this.props.location.pathname.includes(this.props.route)){
            return (
                <Link to={this.props.route} className={'tailbox-selected ' + this.props.className}>
                    <div className={'tailtab-selected'}>
                                    {this.props.icon}
                    </div>
                    <span className={'tail-tooltip'}>{this.props.tooltip}</span>
                </Link>
            )
        }else{
            return (
                <Link to={this.props.route} className={'tailbox ' + this.props.className}>
                    <div className={'tailtab'}>
                                    {this.props.icon}
                    </div>
                    <span className={'tail-tooltip'}>{this.props.tooltip}</span>
                </Link>
            )
        }
        
    }
}

export default withRouter(TailTab);