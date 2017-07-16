import React from 'react';

import shirtBlack1 from '../img/shirt-black-1.png';
import shirtBlack2 from '../img/shirt-black-2.png';
import shirtBlack3 from '../img/shirt-black-3.png';
import shirtBlack4 from '../img/shirt-black-4.png';
import shirtBlack5 from '../img/shirt-black-5.png';
import shirtBlack6 from '../img/shirt-black-6.png';
import shirtBlack7 from '../img/shirt-black-7.png';
import shirtBlack8 from '../img/shirt-black-8.png';
import shirtBlack9 from '../img/shirt-black-9.png';
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

  componentDidMount(){
    initializeCanvas();
  };

  changeTool(tool, src){
    console.log(src);
    var srcStr = src.classList.value;
    console.log(srcStr);
    this.setActive(src);
    //duplicate our state
    const toolstate = {...this.state.tool};
    //change the tools
    const newtoolstate = {name:tool, src: srcStr};
    //update the state
    this.setState({tool:newtoolstate});
  }

  setActive(src){
    const tools = document.querySelectorAll("div.tools *");
    console.log(tools);
    for (var element of tools){
      // console.log(item);
      if (element == src){
        console.log('yes');
        element.classList.add("active");
      }
      else{
        element.classList.remove("active");
      }
    }
  }

  draw(e,tool,src){
    if(!tool){
      return;
    }
    if(!src){
      return;
    }
    src = document.getElementsByClassName(src)[0];
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
    //remove the class active from src
    src.classList.remove("active");
    this.props.save2canvas(tool,src,x,y,w,h);
  };

  redraw(src,x,y,w,h){
    // alert("redraw works!");
    src = document.getElementsByClassName(src)[0];
    console.log(src);
    const canvas = document.querySelector("canvas#canvas");
    const ctx = canvas.getContext('2d');
    ctx.drawImage(src,x,y,w,h);
  }

  eraseBoard(){
    const canvas = document.querySelector("canvas#canvas");
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.props.emptyDrawingState();
  }

  render(){
    return(
      <div className="canvas">
        <canvas id="canvas" width="800" height="600" onClick={(e) => this.draw(e, this.state.tool.name, this.state.tool.src)}></canvas>
        <div className="tools">
          <img className="jersey 1" src={shirtBlack1} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 2" src={shirtBlack2} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 3" src={shirtBlack3} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 4" src={shirtBlack4} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 5" src={shirtBlack5} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 6" src={shirtBlack6} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 7" src={shirtBlack7} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 8" src={shirtBlack8} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 9" src={shirtBlack9} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 10" src={shirtBlack10} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 11" src={shirtBlack11} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 12" src={shirtBlack12} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 13" src={shirtBlack13} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 14" src={shirtBlack14} onClick={(e) => this.changeTool("icon", e.target)}></img>
          <img className="jersey 15" src={shirtBlack15} onClick={(e) => this.changeTool("icon", e.target)}></img>

        </div>
        <button className="EraseCanvas" onClick={() => this.eraseBoard()}>Erase Play</button>
      </div>
    )
  }
}

export default Board;
