import React from 'react';
import {withRouter} from "react-router-dom";
import '../css/App.css';

import WrongUser from './WrongUser';
import Board from "./Board";
import Plays from "./Plays";
import SavePlay from "./SavePlay";
import samplePlays from '../sample-plays';

import base from '../base';
import firebase from 'firebase/app';
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
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      loading:false,
      plays: {},
      drawing:{},
      currentPlay:{},
      syncedState:{
        plays: {},
        userid: null,
        username: null,
        owner: null,
      },
    };
  }

  componentWillMount(){
    console.log("Starting Firebase sync");
    this.setState({loading:true});
    this.ref = base.syncState(`${this.props.match.params.playbookName}`,
      {
        context: this,
        state: 'syncedState',
        then() {
          console.log("Firebase is synced.");
          this.setState({
            loading: false,
          })
        },
      }
    )
  }

  // componentDidMount(){
  // }

  componentWillUnmount(){
    base.removeBinding(this.ref); //refers to the base.syncState above
  }

  loadPlays(){
    var syncedState = {...this.state.syncedState};
    syncedState.plays = samplePlays; //add plays
    this.setState({
      syncedState:syncedState,
    });
  }

  save2canvas(tool,src,x,y,w,h,x2,y2,xArr,yArr){
    //This function will save what was drawn on the canvas to state
        // console.log("saved to console:");
    src.classList.remove("active"); //make sure the source doesn't contain active
    var tempsrc = src.classList.value; //Must convert src to just the classname string for firebase to accept it
        // console.log(src);
    //get state
    const drawState = {...this.state.drawing};
        // console.log(drawState);
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
        // console.log(playName);
    event.preventDefault(); //prevent browser refresh
    const drawState = {...this.state.drawing};
    const syncedState = {...this.state.syncedState};
    const plays = syncedState.plays || {};
    plays[playName] = {};
    plays[playName].name = playName;
    plays[playName].desc = desc;
    plays[playName].items = {};


    //This loops over all the items in the drawstate object
    Object.keys(drawState).forEach( key => {
      plays[playName].items[key]  = drawState[key];
    });
        // console.log(plays);
    syncedState["plays"] = plays;
        // console.log(syncedState);
    //empty drawing state
    this.setState({drawing: {}});
    //save play to state
    this.setState({syncedState: syncedState});
  }

  drawPlay(key){
    this.eraseBoard(); //wipe old play
    //hide noCurrentPlay box
    const noCurrentPlay = document.getElementsByClassName("noCurrentPlay")[0];
    noCurrentPlay.classList.add("slideDown");
        // console.log(key);
    const play = {...this.state.syncedState.plays[key]};
    const items = play.items || null;
    //save the items in the play to the drawing object in state
    this.setState({drawing: items});
        //console.log(play);
        //console.log(items);
    if(items !== null){ //make sure that the play isn't empty
      Object.keys(items).forEach( item => {
        // console.log(item);
        var tool = items[item].tool;
        var src = items[item].src;
        var x = items[item].x;
        var y = items[item].y;
        var w = items[item].w || null;
        var h = items[item].h || null;
        var x2 = items[item].x2 || null;
        var y2 = items[item].y2 || null;
        var xArr = items[item].xArr || null;
        var yArr = items[item].yArr || null;

            // console.log(src);
        this.refs.board.redraw(tool,src,x,y,w,h,x2,y2,xArr,yArr);
      })
    }
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
    // var syncedState = {...this.state.syncedState};
    var tempstate = {...this.state.syncedState};
    tempstate.plays = null;
        // console.log(tempstate);
    this.setState({ syncedState: tempstate, });
    //unhide noCurrentPlay red box if there is no currentPlay
    if(Object.keys(this.state.currentPlay).length === 0){
      const noCurrentPlay = document.getElementsByClassName("noCurrentPlay")[0];
      noCurrentPlay.classList.remove("slideDown");
    }
  }

  authenticate(service){
    if (service === "facebook"){
      var provider = new firebase.auth.FacebookAuthProvider();
    }
        // console.log(`Trying to login using ${service}`);
    firebase.auth().signInWithPopup(provider).then((result) => this.authHandler(result));
  }

  authHandler(authData){
    //console.log(authData); //show the login info
    var username = authData.user.displayName;
    var userid = authData.user.uid;
    console.log(userid);
    //on error show it and return nothing
    if(!userid){
      console.alert("Error! Unable to login. Error Code:EC00001");
      return;
    }
    //if successful, store the playbook name and user in firebase
    const playbookRef = firebase.database().ref(this.props.match.params.playbookName);
    //query the firebase database for the store data onContextMenu
    playbookRef.once('value').then((snapshot) => {
      //console.log(snapshot);
      var snap = snapshot.val() || {};
      //console.log(snap);
      // var key = snapshot.key;
      const data = snap || {}; //get the snapshot of the database or get empty object
      //console.log(data);
      var syncedState = {...this.state.syncedState};
      // now save the login information about the user to state
      syncedState.userid = userid;
      syncedState.username = username;
      this.setState({
        syncedState:syncedState,
      })
      // if no owner exists, claim it as this user's store
      if(!data.owner){
        console.log("This playbook has no OWNER yet");
        syncedState.owner = userid; //save the new owner to state
        syncedState.plays = {}; //initialize plays into the empty state
        this.setState({
          syncedState:syncedState, //update the state
        });
      }
    })
  }

  renderLogin(){
    return(
        <nav className="login">
          <div>
            <h1>Online Rugby Playbook</h1>
            <h1 className="pathname">{this.props.location.pathname}</h1>
            <h3>This playbook is locked</h3>
            <h3 className="lock"><span role="img" aria-label="lock emoji">🔒</span></h3>
            <h2>Sign in to view or edit this playbook</h2>
            <p>This playbook will be claimed by the signed in person to access it.</p>
            <p>If this does not belong to you, you will have to choose a new name for your playbook.</p>
            <button className="facebook login" onClick={()=> this.authenticate('facebook')}>Login with Facebook</button>
            <button className="back2home" onClick={() => this.props.history.push('/')}>Home</button>
          </div>
        </nav>
    )
  }

  logout(){
    //remove the userid from state since the user is no longer loggedin
    var syncedState = {...this.state.syncedState}; //copy the current state
    var oldState = syncedState; //make a second copy
    syncedState.userid = null;
    syncedState.username = null;
    // console.log(syncedState);
    this.setState({
      syncedState: syncedState,
    })
    //tell firebase to logout
    firebase.auth().signOut().then(() => {
      //if successful
      console.log("Signed out of Firebase");
    },
    function(error){
      //unable to logout
      console.log("Unable to logout");
      //repopulate the userid field
      this.setState({
        syncedState: oldState,
      })
    })
  }

  render(){
    // This code is for authenticating the user
    const logout =
          // logout button will be created here but used later
          <div className="logout">
            <p className="greeting">Hi, {this.state.syncedState.username}!</p>
            <button className="logout" onClick={() => this.logout()}>Log Out</button>
          </div>;
    //if no one is logged in then display the login screen
    //console.log(this.state.syncedState.userid);
    var userid = this.state.syncedState.userid;
    if(this.state.loading === false){
      //See if the logged in user is the owner
      if( userid && userid !== this.state.syncedState.owner){
        console.warn("Wrong login! This user is not the owner of the playbook");
        return(<WrongUser username={this.state.syncedState.username} logout={this.logout}/>
        )
      }
      else if(!userid){
        console.log("no userid present");
        return <div>{this.renderLogin()}</div> //show the login screen
      }
      //----end of authentication
      else{
        return(
          <div className="main">
            <div className="header">
              <h1 className="pagetitle">Online Rubgy Playbook</h1>
              {logout}
            </div>
            <div className="left-side">
              <Board save2canvas={this.save2canvas} ref="board" emptyDrawingState={this.emptyDrawingState} eraseBoard={this.eraseBoard}/>
            </div>
            <div className="right-side">
              <SavePlay save2list={this.save2list} />
              <Plays loadPlays={this.loadPlays} plays={this.state.syncedState.plays} currentPlay={this.state.currentPlay} drawPlay={this.drawPlay} deleteAllPlays={this.deleteAllPlays} />
            </div>
          </div>
        )
      }
  }else{
    return(
      <div>
        <p className="loadingtext">Loading...</p>
        <div className="loading"></div>
      </div>
      )
  }
  }
}

export default withRouter(App);
