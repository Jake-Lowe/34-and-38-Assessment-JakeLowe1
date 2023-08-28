 /*****************************************************
functions controlling interface
v1: universal change screen function
v2: process game function for changing the interface based on what happens with the game
v3: altered the process game function to save the score to the db if the player gets a new high score
*****************************************************/

/*****************************************************
// int_changeScreen(screen1, screen2)
// Called by various
// Change screens
// Input: screen to hide, screen to display
// Return: n/a
*****************************************************/
const INNERNAME = document.getElementById("leaderboardNames").innerHTML;
const INNERSCORE = document.getElementById("leaderboardScores").innerHTML;

function int_changeScreen(screen1, screen2) {
  console.log("hiding "+screen1+" and showing "+screen2)
  document.getElementById(screen1).style.display = "none";
  document.getElementById(screen2).style.display = "block";

  //sorts out leaderboard if leaderboard is being shown
  if(screen1=="leaderboardScreen" && screen2=="gamePage") {
    document.getElementById("leaderboardNames").innerHTML = INNERNAME;
    document.getElementById("leaderboardScores").innerHTML = INNERSCORE;
  }
}

/*****************************************************/
// int_processGame(_score, _state)
// Called by startGame
// Update the interface when the user starts or finishes the game
// Input:  user's score, whether they are starting or ending the game
// Return: n/a
/*****************************************************/
function int_processGame(_score, _state) {
  console.log(_state);
  if(_state === "start") {
    console.log("int_processGame: game started");
    document.getElementById("canv").style.display = "block";
    document.getElementById("endScreen").style.display = "none"; 
    document.getElementById("balls").style.display = "none";
    document.getElementById("startGame").classList.remove("w3-green");
    document.getElementById("startGame").classList.add("w3-red");
    document.getElementById("startGame").innerHTML = "Balls Clicker - Stop";
    document.getElementById("newscore").innerHTML = "";

    //Detect ending
  } else if(_state === "end") {
    console.log("int_processGame: player quit");
    handleEnd();
    //Detect ending

    document.getElementById("endScore").innerHTML = "Score: 0";
    document.getElementById("canv").style.display = "none";
    document.getElementById("endScreen").style.display = "block";
    document.getElementById("startGame").classList.remove("w3-red");
    document.getElementById("startGame").classList.add("w3-green");
    document.getElementById("startGame").innerHTML = "Balls Clicker - Start";

    //Detect user finishing for menu
  } else if (_state === "finished") {
    console.log("int_processGame: player finished");
    handleGameOver(score); 
    //end of mini edit here
    
    document.getElementById("endScore").innerHTML = "Score: "+_score;
    document.getElementById("canv").style.display = "none";
    document.getElementById("endScreen").style.display = "block";
    document.getElementById("startGame").classList.remove("w3-red");
    document.getElementById("startGame").classList.add("w3-green");
    document.getElementById("startGame").innerHTML = "Balls Clicker - Start";
    if(_score > userScore.score) {
      console.log("new high score: "+_score);
      console.log("old high score: "+userScore.score);
      //set player's new high score
      document.getElementById("highscore").innerHTML = "High score: "+_score;
      document.getElementById("newscore").innerHTML = "New high score!";
      userScore.score = _score;
      let details = {
        uid: userDetails.uid,
        score: _score,
        username: userDetails.username
      }
      fb_writeRec(BB, userDetails.uid, details);
    }
  }
}