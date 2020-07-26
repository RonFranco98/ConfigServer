import React,{Component} from "react";
import Auth0Lock from "auth0-lock";
import { useAuth0 } from "@auth0/auth0-react";
import Auth from "./auth"

class Login extends Component {
    state = {
        LoggedIn:false
    }
    option = {
        allowSignUp: false,
        autoclose: true
    }
    look = new Auth0Lock(Auth.Auth0_ClientID , Auth.Auth0_Domain , this.option);
    componentWillMount(){
        this.look.on("authenticated", AuthResults => {
            this.props.Changer();
        });

        this.look.checkSession({},(err, authResult)=>{
            if(err){
                return;
            }
            this.props.TokenGetter(authResult.accessToken);
            this.props.Changer();
        });
    }
    constructor(){
        super();
    }
    render() { 
        return <div><button onClick={() => this.look.show()}>login</button><button onClick={() => this.look.logout()}>logout</button></div>
    }
}
 
export default Login;
