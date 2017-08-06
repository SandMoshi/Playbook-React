import React, { Component } from 'react';
import '../css/App.css';
import Board from "./Board";
import Plays from "./Plays";
import SavePlay from "./SavePlay";
import samplePlays from '../sample-plays';

import base from '../base';
import firebase from 'firebase/app';
import database from 'firebase/database';
import 'firebase/auth'; //pulling in the auth service here

class App extends React.Component {
  constructor() {
    super()
    this.loadPlays = this.loadPlays.bind(this);
    this.save2list = this.save2list.bind(this);
    this.save2canvas = this.save2canvas.bind(this);
    this.drawPlay = this.drawPlay.bind(this);
    this.emptyDrawingState = this.emptyDrawingState.bind(this);
    this.eraseBoard = this.eraseBoard.bind(this);
    this.deleteAllPlays = this.deleteAllPlays.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.AuthHandler = this.AuthHandler.bind(this);

    this.state = {
      plays: {},
      drawing:{},
      currentPlay:{},
      userid: null,
      username: null,
      owner: null,
    };
  }

  componentWillMount(){
    this.ref = base.syncState(`${this.props.match.params.playbookName}`,
      {
        context: this,
        state: 'plays',
      }
    )
  }

  componentWillUnmount(){
    base.removeBinding(this.ref); //refers to the base.syncState above
  }

  loadPlays(){
    this.setState({
      plays: samplePlays
    });
  }

  save2canvas(tool,src,x,y,w,h,x2,y2,xArr,yArr){
    //This function will save what was drawn on the canvas to state
    console.log("saved to console:");
    src.classList.remove("active"); //make sure the source doesn't contain active
    var tempsrc = src.classList.value; //Must convert src to just the classname string for firebase to accept it
    console.log(src);
    //get state
    const drawState = {...this.state.drawing};
    console.log(drawState);
    //change the state
    const drawing = {
      tool: tool,
      src: tempsrc,
      x: x,
      y:y,
      w:w,
      h:h,
      x2:x2,
      y2:y2,
      xArr:xArr,
      yArr:yArr,
    };
    const timestamp = Date.now(); //get non duplicating number
    drawState[`drawing-${timestamp}`] = drawing;
    this.setState({drawing: drawState});
  }

  save2list(event, playName, desc){
    console.log(playName);
    event.preventDefault(); //prevent browser refresh
    const drawState = {...this.state.drawing};
    const plays = {...this.state.plays};
    plays[playName] = {};
    plays[playName].name = playName;
    plays[playName].desc = desc;
    plays[playName].items = {};


    //This loops over all the items in the drawstate object
    Object.keys(drawState).forEach( key => {
      plays[playName].items[key]  = drawState[key];
    });
    console.log(plays);
    //empty drawing state
    this.setState({drawing: {}});
    //save play to state
    this.setState({plays: plays});
  }

  drawPlay(key){
    this.eraseBoard(); //wipe old play
    //hide noCurrentPlay box
    const noCurrentPlay = document.getElementsByClassName("noCurrentPlay")[0];
    noCurrentPlay.classList.add("slideDown");
    console.log(key);
    const play = {...this.state.plays[key]};
    const items = play.items;
    //console.log(play);
    //console.log(items);
    Object.keys(items).forEach( item => {
      // console.log(item);
      var tool = items[item].tool;
      const src = items[item].src;
      var x = items[item].x;
      var y = items[item].y;
      var w = items[item].w || null;
      var h = items[item].h || null;
      var x2 = items[item].x2 || null;
      var y2 = items[item].y2 || null;
      var xArr = items[item].xArr || null;
      var yArr = items[item].yArr || null;

      console.log(src);
      this.refs.board.redraw(tool,src,x,y,w,h,x2,y2,xArr,yArr);
    })
    this.setState({
      currentPlay: {
          name: play.name,
          desc: play.desc,
      },}
    )
  }

  emptyDrawingState(){
    this.setState({
      drawing: {}
    });
  }

  eraseBoard(){
    const canvas = document.querySelector("canvas#canvas");
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.emptyDrawingState();
    this.setState({
      currentPlay: {},
    })
  }

  deleteAllPlays(){
    //remove all plays from state
    window.confirm("Are you sure you want to delete all the saved plays? They will be lost forever");
    this.setState({ plays:null });
    //unhide noCurrentPlay red box if there is no currentPlay
    if(Object.keys(this.state.currentPlay).length === 0){
      const noCurrentPlay = document.getElementsByClassName("noCurrentPlay")[0];
      noCurrentPlay.classList.remove("slideDown");
    }
  }

  renderLogin(){
    return(
      <nav className="login">
        <h1>Online Rugby Playbook</h1>
        <h3>Sign in to view/edit this playbook</h3>
        <p>This playbook url has been claimed by another user already.</p>
        <p>If this does not belong to you, you will have to choose a new name for your playbook.</p>
        <button className="facebook login" onClick={()=> this.authenticate('facebook')}>Login with Facebook</button>
      </nav>
    )
  }

  authenticate(service){
    if (service === "facebook"){
      var provider = new firebase.auth.FacebookAuthProvider();
    }
    console.log(`Trying to login using ${service}`);
    firebase.auth().signInWithPopup(provider).then((result) => this.AuthHandler(result));
    // firebase.auth().signInWithPopup(provider).then(this.AuthHandler(result));
    // base.AuthWithOAuthPopup(service,this.AuthHandler);
  }

  AuthHandler(authData){
    console.log(authData); //show the login info
    var username = authData.user.displayName;
    var userid = authData.user.uid;
    console.log(userid);
    //on error show it and return nothing
    if(!userid){
      console.alert("Error! Unable to login. Error Code:pbFappjsL194");
      return;
    }
    //if successful, store the playbook name and user in firebase
    // var playbookname = this.props.match.params.playbookName;
    var data = {};
    const playbookRef = firebase.database().ref(this.props.match.params.playbookName);
    //query the firebase database for the store data onContextMenu
    playbookRef.once('value').then((snapshot) => {
      var snap = snapshot.val();
      var key = snapshot.key;
      const data = snap.key || {}; //get the snapshot of the database or get empty object
      console.log(data);
      // if no owner exists, claim it as this user's store
      if(!data.owner){
        playbookRef.set({
          owner: userid,
        })
      }
      //now save the information about the new owner to state
      this.setState({
        userid: userid,
        username: username,
        owner: data.owner || userid,
      })
    })
  }


  render(){
    // This code if for authenticating the user
    const logout = <button>Log Out</button>  //saving it for later
    //if no one is logged in then display the login screen
    if(!this.state.userid){
      return(
        <div>{this.renderLogin()}</div> //show the login screen
      )
    }
    //See if the logged in user is the owner
    if(this.state.userid != this.state.owner){
      return(
        <div>
          <h2 className="error">Sorry you do not have permission to view this playbook.</h2>
          <h3>If you're trying to create your own playbook, please choose a new name for it.</h3>
          <h3>Or you may have to logout then log back in with another account</h3>
          {logout} //show the logout button
        </div>
      )
    }

    //----end of authentication

    return(
      <div className="main">
        <h1 className="pagetitle">Online Rubgy Playbook</h1>
        {logout}
        <div className="left-side">
          <Board save2canvas={this.save2canvas} ref="board" emptyDrawingState={this.emptyDrawingState} eraseBoard={this.eraseBoard}/>
        </div>
        <div className="right-side">
          <SavePlay save2list={this.save2list} />
          <Plays loadPlays={this.loadPlays} plays={this.state.plays} currentPlay={this.state.currentPlay} drawPlay={this.drawPlay} deleteAllPlays={this.deleteAllPlays} />
        </div>
      </div>
    )
  };
}

export default App
