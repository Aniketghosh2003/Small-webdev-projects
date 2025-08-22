let board;
let boardheight = 640;
let boardwidth = 360;
let context;

let birdheight = 24;
let birdwidth = 34;
let birdx = boardwidth / 8;
let birdy = boardheight / 2;
let birdimg;

let bird = {
  height: birdheight,
  width: birdwidth,
  x: birdx,
  y: birdy,
};

let pipearr = [];
let pipeheight = 512;
let pipewidth = 64;
let pipex = boardwidth;
let pipey = 0;

let topimage;
let bottomimage;

let velocityx = -2;
let velocityy = 0;
let gravity = 0.4;

let gameover = false;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardwidth;
  board.height = boardheight;
  context = board.getContext("2d");

  birdimg = new Image();
  birdimg.src = "./image/flappybird.png";
  birdimg.onload = function () {
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
  };

  topimage = new Image();
  topimage.src = "./image/toppipe.png";

  bottomimage = new Image();
  bottomimage.src = "./image/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placepipes, 1500);
  document.addEventListener("keydown", movebird);
};

function update() {
  requestAnimationFrame(update);
  if (gameover) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  velocityy += gravity;
  bird.y = Math.max(bird.y + velocityy, 0);
  context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameover = true;
  }

  for (let i = 0; i < pipearr.length; i++) {
    let pipe = pipearr[i];
    pipe.x += velocityx;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    if (detectcolision(bird, pipe)) {
      gameover = true;
    }
  }

  while (pipearr.length > 0 && pipearr[0].x < -pipewidth) {
    pipearr.shift();
  }

  if (!gameover) {
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
  }

  if (gameover) {
    context.fillText("Game Over", 5, 90);
  }
}

function placepipes() {
  if (gameover) {
    return;
  }
  let randomy = pipey - pipeheight / 4 - Math.random() * (pipeheight / 2);
  let opensapce = board.height / 4;

  let toppipe = {
    x: pipex,
    y: randomy,
    img: topimage,
    width: pipewidth,
    height: pipeheight,
    passed: false,
  };

  pipearr.push(toppipe);

  let bottompipe = {
    img: bottomimage,
    x: pipex,
    y: randomy + opensapce + pipeheight,
    width: pipewidth,
    height: pipeheight,
    passed: false,
  };
  pipearr.push(bottompipe);
}

function movebird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    velocityy = -6;
    if (gameover) {
      bird.y = birdy;
      pipearr = [];
      score = 0;
      gameover = false;
    }
  }
}

function detectcolision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
