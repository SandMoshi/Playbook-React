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
import arrowRed from '../img/arrow1.png';

import '../css/board.css';
import { initializeCanvas } from '../js/canvas.js';
//import { draw } from '../js/canvas.js';
//import { save2canvas } from '../js/canvas.js';

class Board extends React.Component{

  constructor(){
    super();
    this.changeTool = this.changeTool.bind(this);
    this.toggleDrawing = this.toggleDrawing.bind(this);
    //create empty objects in the state
    this.state = {
      tool:{},
      drawing:{},
      plays:{
        // playname:{},
      },
      "isDrawing": false,
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

  toggleDrawing(bool){
    if (bool === true){
      this.setState({
        isDrawing: true,
      })
    }
    else if (bool === false){
      this.setState({
        isDrawing: false,
      })
    }
    else if (bool == null){
      //get value
      var isDrawing = this.state.isDrawing;
      console.log("isDrawing is " + isDrawing);
      return isDrawing;
    }
  }

  draw(e,tool,src){
    if(!tool){
      return;
    }
    if(!src){
      return;
    }

    const canvas = document.querySelector("canvas#canvas");
    const ctx = canvas.getContext('2d');
    const cWidth = canvas.width;
    const cHeight = canvas.height;
    console.log("Canvas Dimensions: " + cWidth + "  " + cHeight );

    if(tool === "icon"){
      src = document.getElementsByClassName(src)[0];
      console.log("tool = " + tool);
      console.log(src);
      console.log(e);
      const w = (64/802*cWidth); //width of image
      const h = (64/602*cHeight); //height of image
      var rect = canvas.getBoundingClientRect();
      var x = (e.clientX - rect.left - 30);
      var y = (e.clientY - rect.top -30);
      console.log("x: " + x + " y: " + y);
      ctx.drawImage(src,x,y,w,h);
      //remove the class active from src
      src.classList.remove("active");
      x100 = x/cWidth;
      y100 = y/cHeight;
      this.props.save2canvas(tool,src,x100,y100,w,h);
    }
    else if ( tool === "line"){
      //var isDrawing = this.state.isDrawing;

      //Get isDrawing
      var isDrawing = this.toggleDrawing();
      src = document.getElementsByClassName(src)[0];
      // console.log(src);
      var color = src.getAttribute("color");
      var endStyle = src.getAttribute("cap");

      //Check if we have already started drawing a line
      if (isDrawing === false || isDrawing == null ){
        //this is a new line
        console.log("Drawing was off. Maybe a new line.");
        // this.setState({"isDrawing" : true });
        this.toggleDrawing(true);
        ctx.beginPath();
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        ctx.moveTo(x,y);
      }
      else if (isDrawing === true){
        //this is the end point
        console.log("Drawing is on. Maybe ending a line.");
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        ctx.lineTo(x,y);
        ctx.strokeStyle = color;
        ctx.lineCap = endStyle;
        console.log(color);
        ctx.closePath();
        ctx.stroke();
        this.toggleDrawing(false);
      }
    }

  };

  redraw(src,x100,y100,w,h){
    // alert("redraw works!");
    const canvas = document.querySelector("canvas#canvas");
    const ctx = canvas.getContext('2d');
    const cWidth = canvas.width;
    const cHeight = canvas.height;
    x = x100*cWidth;
    y = y100*cHeight;
    src = document.getElementsByClassName(src)[0];
    console.log(src);
    ctx.drawImage(src,x,y,w,h);
  }

  render(){
    return(
      <div className="canvas">
        <canvas id="canvas"  onClick={(e) => this.draw(e, this.state.tool.name, this.state.tool.src)}></canvas>
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
          <img className="line arrow 1" src={arrowRed} color="#e20909" cap="square" onClick={(e) => this.changeTool("line", e.target)}></img>
        </div>
        <button className="EraseCanvas" onClick={() => this.props.eraseBoard()}>Erase Play</button>
      </div>
    )
  }
}

export default Board;
