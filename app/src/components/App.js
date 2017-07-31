import React, { Component } from 'react';
import '../css/App.css';
import Board from "./Board";
import Plays from "./Plays";
import SavePlay from "./SavePlay";
import samplePlays from '../sample-plays';

import base from '../base';

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

    this.state = {
      plays: {},
      drawing:{},
      currentPlay:{},
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

  render(){
    return(
      <div className="main">
        <h1 className="pagetitle">Online Rubgy Playbook</h1>
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
