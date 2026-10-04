const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let catcherX = 0;
let catcherY = 0;

let objects = [];

let score = 0;
let lives = 3;

let gameRunning = false;

let timeLeft = 60;

let gameTimer;
let objectTimer;

let gameMessage = "Press Start Game";


// ==========================
// Canvas Resize
// ==========================

function resizeCanvas() {

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  catcherX = canvas.width / 2;
  catcherY = canvas.height - 70;
}


// ==========================
// Hand Controls Catcher
// ==========================

let targetCatcherX = 0;
let smoothCatcherX = 0;

window.updateCatcher = function (handX, handY) {

  // Convert hand position to canvas position
  targetCatcherX =
    canvas.width - handX * canvas.width;

  // Keep catcher inside canvas
  targetCatcherX = Math.max(
    60,
    Math.min(canvas.width - 60, targetCatcherX)
  );

  // Smooth movement
  smoothCatcherX +=
    (targetCatcherX - smoothCatcherX) * 0.15;

  catcherX = smoothCatcherX;

  catcherY = canvas.height - 70;
};


// ==========================
// Create Falling Object
// ==========================

function createObject() {

  if (!gameRunning) return;

  let speed = 2 + Math.random() * 1.5;

  // Small difficulty increase
  if (score >= 10) {
    speed = 2.5 + Math.random() * 1.5;
  }

  if (score >= 20) {
    speed = 3 + Math.random() * 1.5;
  }

  // Choose object type
  const random = Math.random();

  let type = "normal";

  if (random < 0.15) {
    type = "bonus";
  } 
  else if (random < 0.30) {
    type = "danger";
  }

  objects.push({

    x: Math.random() * (canvas.width - 40) + 20,

    y: -30,

    size: 25,

    speed: speed,

    type: type

  });
}
// ==========================
// Draw Catcher
// ==========================

function drawCatcher() {

  ctx.fillStyle = "#6366f1";

  ctx.beginPath();

  ctx.roundRect(

    catcherX - 60,

    canvas.height - 55,

    120,

    25,

    12

  );

  ctx.fill();
}


// ==========================
// Draw Falling Objects
// ==========================

function drawObjects() {

  objects.forEach(object => {

    ctx.beginPath();

    ctx.arc(
      object.x,
      object.y,
      object.size,
      0,
      Math.PI * 2
    );

    if (object.type === "normal") {

      ctx.fillStyle = "#facc15";

    }

    else if (object.type === "bonus") {

      ctx.fillStyle = "#22c55e";

    }

    else if (object.type === "danger") {

      ctx.fillStyle = "#ef4444";

    }

    ctx.fill();

  });
}


// ==========================
// Update Objects
// ==========================

function updateObjects() {

  objects.forEach(object => {

    object.y += object.speed;


    // Catcher boundaries

    const catcherLeft = catcherX - 60;

    const catcherRight = catcherX + 60;

    const catcherTop = canvas.height - 55;


    // Object boundaries

    const objectBottom = object.y + object.size;

    const objectTop = object.y - object.size;


    // Collision detection

    const horizontalCollision =

      object.x > catcherLeft &&

      object.x < catcherRight;


    const verticalCollision =

      objectBottom > catcherTop &&

      objectTop < canvas.height;


    // Object caught

if (
  horizontalCollision &&
  verticalCollision &&
  !object.caught
) {

  if (object.type === "normal") {

    score += 1;

  }

  else if (object.type === "bonus") {

    score += 3;

  }

  else if (object.type === "danger") {

    lives--;

    updateLives();

  }

  updateScore();

  object.caught = true;


  if (lives <= 0) {

    endGame("GAME OVER");

  }

}


    // Object missed

    if (

      object.y - object.size > canvas.height &&

      !object.missed

    ) {

      lives--;

      updateLives();

      object.missed = true;


      if (lives <= 0) {

        endGame("GAME OVER");

      }

    }

  });


  // Remove finished objects

  objects = objects.filter(object => {

    return !object.caught && !object.missed;

  });

}


// ==========================
// Update Score
// ==========================

function updateScore() {

  const scoreElement =
    document.getElementById("score");

  scoreElement.textContent = score;

}


// ==========================
// Update Lives
// ==========================

function updateLives() {

  const livesElement =
    document.getElementById("lives");

  livesElement.textContent =
    "❤️".repeat(lives);

}


// ==========================
// Update Timer
// ==========================

function updateTimer() {

  const timerElement =
    document.getElementById("timer");

  timerElement.textContent = timeLeft;

}


// ==========================
// Start Game
// ==========================

function startGame() {

  // Reset values

  score = 0;

  lives = 3;

  timeLeft = 60;

  objects = [];

  gameRunning = true;

  gameMessage = "";


  // Update UI

  updateScore();

  updateLives();

  updateTimer();


  // Change button text

  const startButton =
    document.getElementById("startBtn");

  startButton.textContent = "Restart Game";


  // Clear old timers

  clearInterval(gameTimer);

  clearInterval(objectTimer);


  // Create objects every second

 let spawnSpeed = 1000;

if (score >= 5) {
  spawnSpeed = 800;
}

if (score >= 10) {
  spawnSpeed = 600;
}

objectTimer = setInterval(
  createObject,
  spawnSpeed
);


  // Start 60 second timer

  gameTimer = setInterval(() => {

    timeLeft--;

    updateTimer();


    if (timeLeft <= 0) {

      endGame("TIME UP!");

    }

  }, 1000);

}


// ==========================
// End Game
// ==========================

function endGame(message) {

  gameRunning = false;

  gameMessage = message;


  clearInterval(gameTimer);

  clearInterval(objectTimer);

}


// ==========================
// Draw Game Message
// ==========================

function drawGameMessage() {

  if (gameRunning) return;


  ctx.fillStyle =
    "rgba(0, 0, 0, 0.65)";

  ctx.fillRect(

    0,

    0,

    canvas.width,

    canvas.height

  );


  ctx.fillStyle = "white";

  ctx.textAlign = "center";


  ctx.font = "bold 42px Arial";

  ctx.fillText(

    gameMessage,

    canvas.width / 2,

    canvas.height / 2

  );


  if (gameMessage !== "Press Start Game") {

    ctx.font = "20px Arial";

    ctx.fillText(

      `Score: ${score}`,

      canvas.width / 2,

      canvas.height / 2 + 45

    );

  }

}


// ==========================
// Game Loop
// ==========================

function gameLoop() {

  ctx.clearRect(

    0,

    0,

    canvas.width,

    canvas.height

  );


  if (gameRunning) {

    updateObjects();

    drawObjects();

  }


  drawCatcher();

  drawGameMessage();


  requestAnimationFrame(gameLoop);

}


// ==========================
// Start Button
// ==========================

document
  .getElementById("startBtn")
  .addEventListener(

    "click",

    startGame

  );


// ==========================
// Resize
// ==========================

window.addEventListener(

  "resize",

  resizeCanvas

);


// ==========================
// Initialize
// ==========================

resizeCanvas();

updateScore();

updateLives();

updateTimer();

gameLoop();