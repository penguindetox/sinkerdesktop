import React from 'react';
import { withRouter } from '../WithRouter';

class ForgotPasswordComponent extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                forgot password
            </div>
        )
    }
}

export default withRouter(ForgotPasswordComponent);