export function initializeCanvas(){
  const canvas = document.querySelector("canvas#canvas");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = "grey";
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 12;

  console.log(canvas);
  console.log(ctx);


// If you want to draw the background within the canvas (doesn't work with relative urls for now)
  // var background = new Image();
  // background.src = backgroundsrc;
  //
  // background.onload = function(){
  //   ctx.drawImage(background,0,0);
  // }


  var isDrawing = false;
  var lastX = 0;
  var lastY = 0;
  var item = [];
};

export function draw(e,tool,src,state){
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
  var newstate = save2canvas(tool,src,x,y,w,h,state);
};

export function save2canvas(tool,src,x,y,w,h,state){
  //This function will save what was drawn on the canvas to state
  console.log("saved to console:");
  console.log(src);
  //get state
  const drawState = {...state.drawing};
  console.log(drawState);
  //change the state
  const drawing = {
    tool: tool,
    src: src,
    x: x,
    y:x,
    w:w,
    h:h,
  };
  const timestamp = Date.now(); //get non duplicating number
  drawState[`drawing-${timestamp}`] = drawing;
  //this.setState({drawState: drawState});
  return drawState;
}
