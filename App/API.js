const express = require("express");
const TableTools = require("./TableTools");
const appsTableName = "ron";
const AllEnvs = "allDBEnvironments";

exports.router = async function(context){
    var route = [context.bindingData.topDomain,context.bindingData.midDomain];
    /*var AccessToken = context.bindingData.accessToken
    if(!CheckAuthorization(AccessToken)){
        return;
    }*/
    if(route.length < 2){
        return false;
    }
    if(route[0] != "api"){
        return false;
    }
    if(route[1] === "mergeConfig"){
        await exports.mergeConfig(context);
        return true;
    }
    if(route[1] === "createEnv"){
        await exports.createEnv(context);
        return true;
    }
    if(route[1] === "getAllEnv"){
        return await exports.getAllEnv(context);
    }
    if(route[1] === "deleteEnv"){
        await exports.deleteEnv(context);
        return true;
    }
}

exports.getAllEnv = async function(){
    var Envs = await TableTools.getEntity(AllEnvs , appsTableName);
    return Envs[AllEnvs];
}

exports.mergeConfig = async function(req){ //api/mergeConfig
    var Path = req.bindings.req.body.path;
    var App = req.bindings.req.body.appName;
    var Data = req.bindings.req.body.data;
    var Override = req.bindings.req.body.override;
    var Key = Path + "|" + App
    if(Override == true){
        await TableTools.insertOrReplace(Key , Data, appsTableName);
        return;
    }
    var oldDataObj = await TableTools.getEntity(Key, appsTableName);
    if(!oldDataObj){
        await TableTools.insertOrReplace(Key , Data, appsTableName);
        return;
    }
    var oldData = oldDataObj[Key];
    merge(oldData , Data);
    await TableTools.updateEntity(Key , oldData, appsTableName);
}


exports.deleteEnv = async function(req){
    var Envs = await exports.getAllEnv();
    var path = path = req.bindings.req.body.path.split("/");
    deleteEnvInternal(path , Envs , 0);
    await TableTools.updateEntity(AllEnvs, Envs, appsTableName);
}

function deleteEnvInternal(path , Envs , index){
    var CurrPath = path[index];
    if(!Envs[CurrPath]){
        return;
    }
    if(index >= path.length-1){
        if(HaveChildEnv(Envs[CurrPath])){
            return;
        }
        delete Envs[CurrPath];
        return;
    }
    deleteEnvInternal(path, Envs[CurrPath], index+1);
}

exports.createEnv = async function(req){
    var Envs = await exports.getAllEnv();
    var path = path = req.bindings.req.body.path.split("/");
    createEnvInternal(path , Envs , 0);
    await TableTools.updateEntity(AllEnvs, Envs, appsTableName);

}
function createEnvInternal(path , Envs , index){
    var currPath = path[index];
    if(index >= path.length-1){
        if(!Envs[currPath]){
            Envs[currPath] = {};
        }
        return;
    }
    if(!Envs[currPath]){
        return;
    }
    createEnvInternal(path , Envs[currPath] , index+1);
}

function merge(oldData , newData){
    if(!oldData){
        return;
    }
    if(!newData){
        return;
    }
    var newKeys = Object.keys(newData);
    for(var i = 0; i < newKeys.length; i++){
        oldData[newKeys[i]] = newData[newKeys[i]];
    }
}
function HaveChildEnv(obj){
    var keys = Object.keys(obj);
    if(keys.length == 0){
        return false;
    }
    return true;
}
async function CheckAuthorization(accessToken){
    if(!accessToken){
        return false;
    }
    var Bearer = "Bearer "+accessToken;
    const respons = await fetch("https://configserver.us.auth0.com/userinfo" , {
        method: 'GET',
        mode: 'cors',
        headers:{
          "Authorization":Bearer
        }
      });
      if(respons == "Unauthorized"){
        return false;
      }
      return true;
}