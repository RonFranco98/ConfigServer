import React from "react";
import ReactDOM from "react-dom";
import App from "./Component/App";
import { Auth0Provider } from "@auth0/auth0-react";

var Auth0_ClientID = "LPEVhkKuK4BHWS4zky11RFQpJuYftlnf";
var Auth0_Domain = "configserver.us.auth0.com";

ReactDOM.render(
      <App />
, document.getElementById("root"));