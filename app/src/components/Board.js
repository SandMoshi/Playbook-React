import React from 'react';

import shirtBlack10 from '../img/shirt-black-10.png';
import shirtBlack11 from '../img/shirt-black-11.png';
import shirtBlack12 from '../img/shirt-black-12.png';
import shirtBlack13 from '../img/shirt-black-13.png';
import shirtBlack14 from '../img/shirt-black-14.png';
import shirtBlack15 from '../img/shirt-black-15.png';

import '../css/board.css';
import { initializeCanvas } from '../js/canvas.js';
//import { draw } from '../js/canvas.js';
//import { save2canvas } from '../js/canvas.js';

class Board extends React.Component{

  constructor(){
    super();
    this.changeTool = this.changeTool.bind(this);
    //create empty objects in the state
    this.state = {
      tool:{},
      drawing:{},
      plays:{
        // playname:{},
      },
    };
  };

  changeTool(tool, src){
    console.log(src);
    //duplicate our state
    const toolstate = {...this.state.tool};
    //change the tools
    const newtoolstate = {name:tool, src: src};
    //update the state
    this.setState({tool:newtoolstate});
  }

  componentDidMount(){
    initializeCanvas();
  };

  draw(e,tool,src){
    if(!tool){
      return;
    }
    if(!src){
      return;
    }
    console.log("tool = " + tool);
    console.log(src);
    console.log(e);
    const w = 64; //width of image
    const h = 64; //height of image
    const canvas = document.querySelector("canvas#canvas");
    const ctx = canvas.getContext('2d');
    var isDrawing = true;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left -30;
    var y = e.clientY - rect.top -30;
    console.log("x: " + x + " y: " + y);
    ctx.drawImage(src,x,y,w,h);
    this.props.save2canvas(tool,src,x,y,w,h);
  };

  redraw(src,x,y,w,h){
    // alert("redraw works!");
    console.log(src);
    const canvas = document.querySelector("canvas#canvas");
    const ctx = canvas.getContext('2d');
    ctx.drawImage(src,x,y,w,h);
  }

  eraseBoard(){
    const canvas = document.querySelector("canvas#canvas");
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  render(){
    return(
      <div className="canvas">
        <canvas id="canvas" width="800" height="600" onClick={(e) => this.draw(e, this.state.tool.name, this.state.tool.src)}></canvas>
        <div className="tools">
          <img className="jersey 10" src={shirtBlack10} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 11" src={shirtBlack11} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 12" src={shirtBlack12} onClick={(e) => this.changeTool("icon", e.target)}></img>
        </div>
        <button className="EraseCanvas" onClick={() => this.eraseBoard()}>Erase Play</button>
      </div>
    )
  }
}

export default Board;
