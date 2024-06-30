let board;
let boardwidth = 750;
let boardheight = 250;
let context;

//dino
let dinowidth = 85;
let dinoheight = 95;
let dinox = 50;
let dinoy = boardheight - dinoheight;
let dinoimg;

let dino = {
  x: dinox,
  y: dinoy,
  height: dinoheight,
  width: dinowidth,
};

//cactus
let cactusarray = [];

let cactusheight = 70;
let cactus1width = 35;
let cactus2width = 70;
let cactus3width = 105;

let cactusx = 700;
let cactusy = boardheight - cactusheight;

let cactus1img;
let cactus2img;
let cactus3img;

let velocityx = -8;
let velocityy = 0;
let gravity = 0.4;

let gameover = false;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardheight;
  board.width = boardwidth;

  context = board.getContext("2d");

  dinoimg = new Image();
  dinoimg.src = "./img/dino.png";
  dinoimg.onload = function () {
    context.drawImage(dinoimg, dinox, dinoy, dinowidth, dinoheight);
  };

  cactus1img = new Image();
  cactus1img.src = "./img/cactus1.png";

  cactus2img = new Image();
  cactus2img.src = "./img/cactus2.png";

  cactus3img = new Image();
  cactus3img.src = "./img/cactus3.png";

  requestAnimationFrame(update);
  setInterval(getcactus, 1000);
  document.addEventListener("keydown", movedino);
};

function update() {
  requestAnimationFrame(update);

  if (gameover) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  velocityy += gravity;
  dino.y = Math.min(dino.y + velocityy, dinoy);

  context.drawImage(dinoimg, dino.x, dino.y, dino.width, dino.height);

  for (let i = 0; i < cactusarray.length; i++) {
    let cactus = cactusarray[i];
    cactus.x += velocityx;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (detectcollision(dino, cactus)) {
      gameover = true;
      dinoimg.src = "./img/dino-dead.png";

      dinoimg.onload = function () {
        context.drawImage(dinoimg, dino.x, dino.y, dino.width, dino.height);
      };
    }
  }
  context.fillstyle = "black";
  context.font = "20px courier";
  score++;
  context.fillText(score,5,20);
}

function movedino(e) {
  if (gameover) {
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoy) {
    velocityy = -10;
  }
}

function getcactus() {
  if (gameover) {
    return;
  }

  let cactus = {
    img: null,
    height: cactusheight,
    width: null,
    x: cactusx,
    y: cactusy,
  };

  let chanceofcactus = Math.random();
  if (chanceofcactus > 0.9) {
    cactus.img = cactus3img;
    cactus.width = cactus3width;
    cactusarray.push(cactus);
  } else if (chanceofcactus > 0.7) {
    cactus.img = cactus2img;
    cactus.width = cactus2width;
    cactusarray.push(cactus);
  } else if (chanceofcactus > 0.5) {
    cactus.img = cactus1img;
    cactus.width = cactus1width;
    cactusarray.push(cactus);
  }

  if (cactusarray.length > 5) {
    cactusarray.shift();
  }
}

function detectcollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.width &&
    a.y + a.height > b.y
  );
}
