import React, { Component } from 'react';
import '../css/App.css';
import Board from "./Board";
import Plays from "./Plays";
import SavePlay from "./SavePlay";
import samplePlays from '../sample-plays';


class App extends React.Component {
  constructor() {
    super()
    this.loadPlays = this.loadPlays.bind(this);
    this.save2list = this.save2list.bind(this);
    this.save2canvas = this.save2canvas.bind(this);
    this.drawPlay = this.drawPlay.bind(this);

    this.state = {
      plays: {},
      drawing:{}
    };
  }

  loadPlays(){
    this.setState({
      plays: samplePlays
    });
  }

  save2canvas(tool,src,x,y,w,h){
    //This function will save what was drawn on the canvas to state
    console.log("saved to console:");
    console.log(src);
    //get state
    const drawState = {...this.state.drawing};
    console.log(drawState);
    //change the state
    const drawing = {
      tool: tool,
      src: src,
      x: x,
      y:y,
      w:w,
      h:h,
    };
    const timestamp = Date.now(); //get non duplicating number
    drawState[`drawing-${timestamp}`] = drawing;
    this.setState({drawing: drawState});
  }

  save2list(event, playName){
    console.log(playName);
    event.preventDefault(); //prevent browser refresh
    const drawState = {...this.state.drawing};
    const plays = {...this.state.plays};
    plays[playName] = {};
    plays[playName].name = playName;
    plays[playName].desc = "None yet";
    plays[playName].items = {};


    //This loops over all the items in the drawstate object
    Object.keys(drawState).forEach( key => {
      plays[playName].items[key]  = drawState[key];
    });
    console.log(plays);
    this.setState({plays: plays});
  }

  drawPlay(key){
    console.log(key);
    const play = {...this.state.plays[key]};
    const items = play.items;
    //console.log(play);
    //console.log(items);
    Object.keys(items).forEach( item => {
      // console.log(item);
      var src = items[item].src;
      var x = items[item].x;
      var y = items[item].y;
      var w = items[item].w;
      var h = items[item].h;
      // console.log(src);
      this.refs.board.redraw(src,x,y,w,h);
    })
  }

  render(){
    return(
      <div className="main">
        <h1 className="pagetitle">Online Rubgy Playbook</h1>
        <div className="left-side">
          <Board save2canvas={this.save2canvas} ref="board"/>
        </div>
        <div className="right-side">
          <SavePlay save2list={this.save2list} />
          <Plays loadPlays={this.loadPlays} plays={this.state.plays} drawPlay={this.drawPlay}/>
        </div>
      </div>
    )
  };
}

export default App
