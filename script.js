const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = 2;
const numberOfBricks = 30;
let activeBricks = numberOfBricks;
let numberOfColumns = 5;
let numberOfRows = 3;
let bricks = [];
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var scoreContainer = document.getElementById("score");
scoreContainer.innerText = "Score :- 0";

function updateScore() {
  const score = getScore();

  scoreContainer.innerText = `Score :- ${score}`;
  if (score === numberOfColumns * numberOfRows) {
    alert("Congratulations you won the game,lol");
    window.location.reload();
    clearInterval(interval);
  }
}

function getScore() {
  var score = 0;
  for (var r = 0; r < numberOfRows; r++) {
    for (var c = 0; c < numberOfColumns; c++) {
      if (bricks[r][c].status === 0) score++;
    }
  }

  return score;
}

function generateAllBricks() {
  for (var r = 0; r < numberOfRows; r++) {
    bricks[r] = [];
    for (var c = 0; c < numberOfColumns; c++) {
      bricks[r][c] = { x: r, y: c, status: 1 }; //status 1 means brick is alive
    }
  }
  console.log(bricks);
}

function drawAllBricks() {
  //this will draw all bricks in our canvas
  for (var r = 0; r < numberOfRows; r++) {
    for (var c = 0; c < numberOfColumns; c++) {
      var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      if (!bricks[r][c]) bricks[r][c] = { x: brickX, y: brickY };
      else {
        bricks[r][c].x = brickX;
        bricks[r][c].y = brickY;
      }
      if (bricks[r][c].status) {
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function checkBoundaryHit() {
  if (x + dx + ballRadius >= canvasWidth || x + dx <= ballRadius) dx = -dx;
  if (y + dy <= ballRadius) dy = -dy;
  else if (y + dy > canvasHeight - ballRadius) {
    //check for paddle bounce
    if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
    else handleGameOver();
  }
}

function handleGameOver() {
  alert("Game over, your score is " + getScore());
  updateScore();
  window.location.reload();
  clearInterval(interval);
}

function collisionDetection() {
  for (var r = 0; r < numberOfRows; r++) {
    for (var c = 0; c < numberOfColumns; c++) {
      var b = bricks[r][c];
      //check if ball in a rang of brick
      if (
        y <= b.y + brickHeight &&
        y >= b.y &&
        x >= b.x &&
        x <= b.x + brickWidth &&
        b.status === 1
      ) {
        dy = -dy;
        b.status = 0;
        updateScore();
        //delete bricks[r][c];
      }
    }
  }
}

function draw() {
  ctx.beginPath();
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095D";
  ctx.fill();
  ctx.closePath();
  checkBoundaryHit();
  x += dx;
  y += dy;
  drawAllBricks();
  drawPaddle();
  collisionDetection();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

generateAllBricks();
drawAllBricks();
const interval = setInterval(draw, 20);
window.onkeydown = (e) => {
  if (e.key == "Right" || e.key == "ArrowRight") {
    if (paddleX + 10 + paddleWidth <= canvasWidth) paddleX = paddleX + 10;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    if (paddleX - 10 >= 0) paddleX = paddleX - 10;
  }
};
