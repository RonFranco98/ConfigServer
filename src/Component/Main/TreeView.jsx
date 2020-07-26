import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import {FolderOpen , Folder} from '@material-ui/icons';
import TreeItem from '@material-ui/lab/TreeItem';



const Styles ={
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  }
};
class EnvTree extends Component{
  state = {
    data:undefined
  }
  async componentDidMount(){
    const Data = await this.fetchEnvs();
    console.log(Data)
    this.setState({data:Data});
  }
  render(){
    const TreeItems = this.CreateTreeItems(this.state.data);
    return (
      <TreeView
        className={this.props.classes.root}
        defaultCollapseIcon={<Folder />}
        defaultExpandIcon={<FolderOpen />}
      >
        {TreeItems}
      </TreeView>
    );
  }
  CreateTreeItems(Json){
  if(!Json){
      return;
  }
  var Keys = Object.keys(Json);
  var payload = [];
  for(var i = 0; i < Keys.length; i++){
      var CurrKey = Keys[i];
      if(Json[CurrKey] == {}){
          return <TreeItem nodeId={CurrKey} label={CurrKey} />;
      }
      payload.push(<TreeItem nodeId={CurrKey} label={CurrKey}>{this.CreateTreeItems(Json[CurrKey])}</TreeItem>);
  }
  return payload
  }
  async fetchEnvs(){
    const respons = await fetch("/api/getAllEnv" , {
      method: 'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        accessToken:this.props.AccessToken
      })
    });
    const Data = await respons.json();
    return Data
  }
}

export default withStyles(Styles)(EnvTree);
