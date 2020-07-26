import React, { Component } from 'react';
import EnvDrawer from "./EnvDrawer"
import { Button, Drawer, Box } from '@material-ui/core';
function Main(props){
    return (
      <React.Fragment>
        <EnvDrawer AccessToken={props.AccessToken} />
      </React.Fragment>
    );
}
 
export default Main;