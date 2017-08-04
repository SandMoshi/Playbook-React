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
import lineRed from '../img/line1.png';
import lineSegRed from '../img/line-seg2.png';

// import '../css/board.css';
import { initializeCanvas } from '../js/canvas.js';
//import { draw } from '../js/canvas.js';
//import { save2canvas } from '../js/canvas.js';

class Board extends React.Component{

  constructor(){
    super();
    this.changeTool = this.changeTool.bind(this);
    this.toggleDrawing = this.toggleDrawing.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.drawTempLine = this.drawTempLine.bind(this);
    //create empty objects in the state
    this.state = {
      tool:{},
      drawing:{},
      plays:{
        // playname:{},
      },
      "isDrawing": false,
      tempxy:{},
    };
  };

  componentDidMount(){
    initializeCanvas();
  };

  changeTool(tool, src){
    console.log(src);
    //always remove active
    src.classList.remove("active");
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

  eraseTempCanvas(){
    const tempcanvas = document.querySelector("canvas#tempcanvas");
    const ctx2 = tempcanvas.getContext('2d');
    ctx2.clearRect(0, 0, tempcanvas.width, tempcanvas.height);
  }

  drawTempLine(e, src){
    console.log("temp line is being drawn");
    const tempcanvas = document.querySelector("#tempcanvas");
    const ctx2 = tempcanvas.getContext('2d');
    var rect = tempcanvas.getBoundingClientRect();
    var xnew = e.clientX - rect.left;
    var ynew = e.clientY - rect.top;
    console.log(xnew +" , " + ynew);
    //check to see if segmented lineWidth
    if(src.classList.contains('seg')){
      var xArr = this.state.tempxy.xArr;
      var yArr = this.state.tempxy.yArr;
      var x0 = xArr[xArr.length - 1]*tempcanvas.width;
      var y0 = yArr[yArr.length - 1]*tempcanvas.height;
      console.log("xArr = " + x0);
    }
    else{
      var x0 = this.state.tempxy.x;
      var y0 = this.state.tempxy.y;
    }
    console.log(x0 +"," +y0);
    this.eraseTempCanvas();
    ctx2.beginPath();
    ctx2.moveTo(x0,y0);
    ctx2.lineTo(xnew,ynew);
    console.log(src);
    var color = src.getAttribute("color");
    var endStyle = src.getAttribute("linecap");
    ctx2.lineWidth = 6;
    ctx2.closePath();
    ctx2.stroke();
  }

  handleMouseMove(e) {
    // console.log(e);
    var isDrawing = this.toggleDrawing();
    if(isDrawing){
      //move (2) to wherever mouse is
      const pTwo = document.querySelector("p.two");
      const canvas = document.querySelector("canvas#canvas");
      var rect = canvas.getBoundingClientRect();
      var x = (e.clientX - rect.left);
      var y = (e.clientY - rect.top);
      pTwo.style.display= "block";
      pTwo.style.left = x + 15 +  "px";
      pTwo.style.top = y - 45 + "px";
      //Check if line is being drawn
      const tool = this.state.tool.name;
      var src = this.state.tool.src;
      src = document.getElementsByClassName(src)[0];
      if(tool === "line"){
        this.drawTempLine(e, src);
      }
    }
  }

  handleKeyDown(e){
    //listen for escape
    console.log("key pressed!");
    if(e.keydown === 27){
      console.alert("Esc keypress detected!");
    }
  }

  handleRightClick(e,tool,src){
    console.log(src);
    e.preventDefault();
    // alert("Right Click detected");
    //If no src then do nothing
    if(!src){
      return;
    }
    if(src.indexOf(' seg') != -1){
        //end the drawing
        const canvas = document.querySelector("canvas#canvas");
        const ctx = canvas.getContext('2d');
        ctx.closePath();
        //clear tempcanvas
        this.eraseTempCanvas();
        this.toggleDrawing(false);
        const rightClickmsg = document.getElementById("rightClickmsg");
        rightClickmsg.classList.add("hidden");
        //grab drawing temp data from state
        const x100 = this.state.tempxy.x100;
        const y100 = this.state.tempxy.y100;
        const xArr = this.state.tempxy.xArr;
        const yArr = this.state.tempxy.yArr;
        src = document.getElementsByClassName(src)[0];
        //now save the drawing data to state waiting to be turned into a play
        this.props.save2canvas("line",src,x100,y100,null,null,null,null,xArr,yArr);

        //hide (1) and (2)
        const pOne = document.querySelector("p.one");
        const pTwo = document.querySelector("p.two");
        pOne.style.display = "none";
        pTwo.style.display = "none";
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

    if( tool === "icon" ){
      //This is for drawing jerseys and images
      src = document.getElementsByClassName(src)[0];
      console.log("tool = " + tool);
      console.log(src);
      console.log(e);
      const w = (64/802*cWidth*1.3); //width of image
      const h = (64/602*cHeight*1.3); //height of image
      var rect = canvas.getBoundingClientRect();
      var manualOffset = 40/800 * cWidth;
      var x = (e.clientX - rect.left - manualOffset);
      var y = (e.clientY - rect.top - manualOffset);
      console.log("x: " + x + " y: " + y);
      ctx.drawImage(src,x,y,w,h);
      //remove the class active from src
      src.classList.remove("active");
      var x100 = x/cWidth;
      var y100 = y/cHeight;
      this.props.save2canvas(tool,src,x100,y100,w,h,null,null,null,null);
    }
    else if ( tool === "line"){
      //This is for drawing lines

      //Get isDrawing
      var isDrawing = this.toggleDrawing();
      src = document.getElementsByClassName(src)[0];
      // console.log(src);
      var color = src.getAttribute("color");
      var endStyle = src.getAttribute("linecap");

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
        var x100 = x/cWidth;
        var y100 = y/cHeight;
        var xArr = []; //array that will hold x100 values
        var yArr = [];
        xArr[0] = x100;
        yArr[0] = y100;
        this.setState({tempxy:{x:x,y:y,x100:x100,y100:y100,xArr:xArr,yArr:yArr}});
        //Display (1) above canvas
        const pOne = document.querySelector("p.one");
        const pTwo = document.querySelector("p.two");
        pOne.style.top = y - 5 + "px";
        pOne.style.left = x - 30 + "px";
        pOne.style.display = "block";
      }
      else if (isDrawing === true){
        //this is the end point
        console.log("Drawing is on. Maybe ending a line or segmented line.");
        var rect = canvas.getBoundingClientRect();
        var xnew = e.clientX - rect.left;
        var ynew = e.clientY - rect.top;
        ctx.lineTo(xnew,ynew);
        ctx.strokeStyle = color;
        ctx.lineCap = endStyle;
        ctx.lineWidth = 6;
        console.log(color);
        if(src.classList.contains('seg')){
            //do nothing
            ctx.stroke();
            const rightClickmsg = document.getElementById("rightClickmsg");
            rightClickmsg.classList.remove("hidden");
            //grab the latest xArr and yArr
            var xArr = this.state.tempxy.xArr;
            var yArr = this.state.tempxy.yArr;

            var xnew200 = xnew/cWidth;
            var ynew200 = ynew/cHeight;
            //push new values to array
            xArr.push(xnew200);
            yArr.push(ynew200);
            //save the new x and y arrays to state
            const tempxy = {...this.state.tempxy};
            tempxy[xArr] = xArr;
            tempxy[yArr] = yArr;
            this.setState({tempxy:tempxy});
        }
        else{
          ctx.closePath();
          ctx.stroke();
          this.toggleDrawing(false);
          //clear tempcanvas
          this.eraseTempCanvas();
          var x2 = xnew;
          var y2 = ynew;
          var x200 = x2/cWidth;
          var y200 = y2/cHeight;
          //grab starting point data from state
          const x100 = this.state.tempxy.x100;
          const y100 = this.state.tempxy.y100;
          //save drawing data to state
          this.props.save2canvas(tool,src,x100,y100,null,null,x200,y200,null,null);
          //hide (1) and (2)
          const pOne = document.querySelector("p.one");
          const pTwo = document.querySelector("p.two");
          pOne.style.display = "none";
          pTwo.style.display = "none";

        }
        // console.log("x100/y100:" + x100 + " / " +y100);
      }
    }

  };

  redraw(tool,src,x100,y100,w,h,x200,y200,xArr,yArr){
    // alert("redraw works!");
    src = document.getElementsByClassName(src)[0];
    const canvas = document.querySelector("canvas#canvas");
    const ctx = canvas.getContext('2d');
    const cWidth = canvas.width;
    const cHeight = canvas.height;
    var x = x100*cWidth;
    var y = y100*cHeight;
    var x2 = x200*cWidth;
    var y2 = y200*cHeight;
    w = (64/800*cWidth*1.3); //width of image
    h = (64/600*cHeight*1.3); //height of image

    console.log("Now choosing what to redraw");
    if (tool === "icon"){
      console.log(src);
      ctx.drawImage(src,x,y,w,h);
    }
    else if (tool === "line"){
      console.log("Chose to redraw a line;" + src);
      var color = src.getAttribute("color");
      var endStyle = src.getAttribute("linecap");
      ctx.beginPath();
      //check if line is segmented
      if(src.classList.contains('seg')){
        var x0 = xArr[0]*cWidth;
        var y0 = yArr[0]*cHeight;
        ctx.moveTo(x0,y0);
        //loop over all x and y and draw each
        for(var i = 1; i < xArr.length;i++){
          var x = xArr[i]*cWidth;
          var y = yArr[i]*cHeight;
          ctx.lineTo(x,y);
        }
      }
      else{
        ctx.moveTo(x,y)
        ctx.lineTo(x2,y2);
      }
      ctx.strokeStyle = color;
      ctx.lineCap = endStyle;
      ctx.lineWidth = 6;
      console.log(color);
      // ctx.closePath();
      ctx.stroke();
      this.toggleDrawing(false);
    }

  }

  render(){
    return(
      <div className="canvas">
        <div className="plasticFilm">
          <p className="one">&#10122;</p>
          <p className="two">&#10123;</p>
        </div>
        <canvas id="tempcanvas"  onClick={(e) => this.draw(e, this.state.tool.name, this.state.tool.src)} onContextMenu={(e) => this.handleRightClick(e,this.state.tool.name, this.state.tool.src)} onMouseMove={(e) => this.handleMouseMove(e)} ></canvas>
        <canvas id="canvas"></canvas>
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
          <img className="line 1" src={lineRed} color="#e20909" onClick={(e) => this.changeTool("line", e.target)}></img>
          {/* <img className="line arrow 1" src={arrowRed} color="#e20909" cap="square" onClick={(e) => this.changeTool("line", e.target)}></img> */}
          <img className="line seg 1" src={lineSegRed} color="#e20909" onClick={(e) => this.changeTool("line", e.target)}></img>
        </div>
        <button className="EraseCanvas" onClick={() => this.props.eraseBoard()}>Erase Play</button>
        <p className="helper hidden" id="rightClickmsg">Right Click to Stop</p>
      </div>
    )
  }
}

export default Board;
