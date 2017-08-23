export function initializeCanvas(){
  const canvas = document.querySelector("#canvas");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const ctx = canvas.getContext('2d');

  const tempcanvas = document.querySelector("#tempcanvas");
  tempcanvas.width = tempcanvas.offsetWidth;
  tempcanvas.height = tempcanvas.offsetHeight;


  ctx.strokeStyle = "grey";
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 12;

      // console.log(canvas);
      // console.log(ctx);
};
