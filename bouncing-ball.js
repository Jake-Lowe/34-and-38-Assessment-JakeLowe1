/*****************************************************
bouncing ball game

v1: basic skeleton game
v2: calculate score 
v3: process score and send to db
v4: manages interface after the game is finished
*****************************************************/
const BALLNUM = 10;
const BALLVEL = [-3, -2, -1, 1, 2, 3];

var debugCounter = false;
var timer;
var interval;
var canvas;
var x;
var y;
var misses = 0;
var hitscore = 0;
let circles = [];
let xSpeed = [];
let ySpeed = [];
var hitBall = false;
var score;
const DIA = 50;

let circlesarray;

/*****************************************************/
// setup()
/*****************************************************/
function setup() {
  timer = 0;
  xSpeed = [5, 5, 5];
	ySpeed = [5, 5, 5];
  fb_initialise();
  textSize(32);
}

/*****************************************************/
// bb_createCanv()
// called when the game starts
// creates the canvas and puts it inside the html interface
/*****************************************************/
function bb_createCanv() {
  //html element for the canvas to go inside
  let canv = document.getElementById("canv");
  canvas = createCanvas(canv.offsetWidth, canv.offsetHeight);
  canvas.parent('canv');
  canvas.position(canv.offsetLeft, canv.offsetTop);
  console.log("created");
  document.getElementById("defaultCanvas0").style.display = "block";
}

/*****************************************************/
// bb_startGame()
// sets up the game and ends it if the user is finished
/*****************************************************/
function bb_startGame() {
  if(debugCounter == false) {
    int_processGame(hitscore, "start");
    bb_createCanv();
    canvas.mouseClicked(bb_ballClicked);
    console.log("game started");
    debugCounter = true;
    timer = 0;
    misses = 0;
    hitscore = 0;
    bb_resetGame();
    interval = setInterval(bb_countUp, 1000);
    
  for (var i = 0; i < BALLNUM; i++) {
  x = random(0, windowWidth-100-DIA/2);
  y = random(0, windowHeight-100-DIA/2);
  
  circles[i] = {
    x:x,
    y:y,
    diameter:DIA,
    xSpeed: random(BALLVEL),
    ySpeed: random(BALLVEL),

     bounce: function() {
        if (this.x + DIA/2 > width) {
            this.xSpeed = -this.xSpeed
            this.x = width-DIA/2
        } else if (this.x - DIA/2 < 0) {
            this.xSpeed = -this.xSpeed
            this.x = 0+DIA/2
        }
        
        if (this.y + DIA/2 > height) {
            this.ySpeed = -this.ySpeed
            this.y = height-DIA/2
        } else if (this.y - DIA/2 < 0) {
            this.ySpeed = -this.ySpeed
            this.y = 0+DIA/2
        }
    },

      move: function() {
        this.x = this.x + this.xSpeed;
        this.y = this.y - this.ySpeed;
      },

      display: function() {
        fill(200, 200, 200);
        ellipse(this.x, this.y, DIA);
        ellipse(this.x, this.y, DIA);
        fill(0, 102, 153);
      }

    }
  };
  } else {
    console.log("game ended");
    debugCounter = false;
    clearInterval(interval);
    score = Math.round(hitscore*100/(((timer/5)*((misses+1))/3)/10))
    if(circles.length > 0) {
      int_processGame(score, "end");
    } else {
      int_processGame(score, "finished");
    }
  }
}

/*****************************************************/
// bb_updateTimer(_elementId, timer)
// sets the timer to an html element
/*****************************************************/
function bb_updateTimer(_elementId, timer) {
    document.getElementById(_elementId).innerHTML = timer;
}

/*****************************************************/
// bb_countUp()
// makes the timer count up
/*****************************************************/
function bb_countUp() {
  if(debugCounter == true){
  timer = timer+1;
  console.log(timer);
  }
}

/*****************************************************/
// bb_resetGame()
// called when the game is finished. This displays the user's end stats
/*****************************************************/
function bb_resetGame() {
  console.log("reset");
  document.getElementById("hits").innerHTML = "Hits: "+hitscore;
  document.getElementById("misses").innerHTML = "Misses: "+misses;
  document.getElementById("timer").innerHTML = "Timer: "+timer;
}

/*****************************************************/
// bb_ballClicked()
// pops a ball if you click on it. Calls the function to end the game if the user has clicked every ball.
/*****************************************************/
function bb_ballClicked() {
  hitBall = false;
    for (var i = 0; i < circles.length; i++) {
        var px2ball = dist(circles[i].x, circles[i].y, mouseX, mouseY)
        if (px2ball <= DIA/2) {
          circles.splice(i, 1)
          hitscore = 10-(circles.length);
          document.getElementById("hits").innerHTML = "Hits: "+hitscore;
          hitBall = true;
        }
      if(circles.length == 0){
        bb_startGame();
      }
    }
  if(hitBall === false) {
    misses=misses+1;
    document.getElementById("misses").innerHTML = "Misses: "+misses;
  }
}

/*****************************************************/
// draw()
/*****************************************************/
function draw() {
  background(200);
  bb_updateTimer("timer", "Timer: "+timer);
  
  for (i=0; i < circles.length; i++) {
    circles[i].move();
    circles[i].bounce();
    circles[i].display();
  }
}
/*****************************************************/
//   END OF CODE
/*****************************************************/