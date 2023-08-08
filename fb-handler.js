/*****************************************************
// functions to process firebase
v1: basic firebase functions configured to my db
v2: altered the process all function to process a leaderboard the way I want
v3: altered the process rec function to check if the user is admin
*****************************************************/

const DETAILS = "Users";
const BB = "Scores";
const ADMIN = "Admin";

var userDetails = {
  uid:      '',
  email:    '',
  name:     '',
  username: '',
  photoURL: '',
  age: '',
  gender: '',
  phone: ''
};

var userScore = {
  uid: '',
  username: '',
  score: ''
};

var userAdmin = {
  uid: '',
  username: '',
  admin: ''
};

//calls the firebase login function with a parameter (called through html)
function fb_html_login() {
  fb_login(userDetails);
}
/*****************************************************/
// fb_initialise()
// Called by setup
// Initialize firebase
// Input: n/a
// Return: initializes database
/*****************************************************/
function fb_initialise() {
  console.log('fb_initialise: ');
  // PLACE YOUR CONFIG FROM THE FIREBASE CONSOLE BELOW <========
  const firebaseConfig = {
    apiKey: "AIzaSyDDeaZ17UxGkp5I3YYbfmsGic4D3WUdxN8",
    authDomain: "comp-2022-jake-lowe.firebaseapp.com",
    databaseURL: "https://comp-2022-jake-lowe-default-rtdb.firebaseio.com",
    projectId: "comp-2022-jake-lowe",
    storageBucket: "comp-2022-jake-lowe.appspot.com",
    messagingSenderId: "702981085270",
    appId: "1:702981085270:web:f6d5a237803e1b633e03f7",
    measurementId: "G-H5EJRMN6XP"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase);	
		
  database = firebase.database();
}

/*****************************************************/
// fb_login(_dataRec)
// Called by setup
// Login to Firebase
// Input: where to save the google data
// Return: user's details
/*****************************************************/
function fb_login(_dataRec) {
  console.log('fb_login: ');
  firebase.auth().onAuthStateChanged(newLogin);

  function newLogin(user) {
    if (user) {
      // user is signed in, so save Google login details
      _dataRec.uid      = user.uid;
      _dataRec.email    = user.email;
      _dataRec.name     = user.displayName;
      _dataRec.photoURL = user.photoURL;
      loginStatus = 'logged in';
      console.log('fb_login: status = ' + loginStatus);
      console.log(user);
      console.log(userDetails);
      fb_readRec(DETAILS, userDetails.uid, userDetails, fb_processLoginData);
    } 
    else {
      // user NOT logged in, so redirect to Google login
      loginStatus = 'logged out';
      console.log('fb_login: status = ' + loginStatus);

      var provider = new firebase.auth.GoogleAuthProvider();
      //firebase.auth().signInWithRedirect(provider); // Another method
      firebase.auth().signInWithPopup(provider).then(function(result) {
        _dataRec.uid      = user.uid;
        _dataRec.email    = user.email;
        _dataRec.name     = user.displayName;
        _dataRec.photoURL = user.photoURL;
        loginStatus = 'logged in via popup';
        console.log('fb_login: status = ' + loginStatus);
        fb_readRec(DETAILS, userDetails.uid, userDetails, fb_processLoginData);
      })
      // Catch errors
      .catch(function(error) {
        if(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          loginStatus = 'error: ' + error.code;
          console.log('fb_login: error code = ' + errorCode + '    ' + errorMessage);
        }
      });
    }
  }
}

/*****************************************************/
// fb_writeRec(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: n/a
/*****************************************************/
function fb_writeRec(_path, _key, _data) { 
    console.log('fb_WriteRec: path= ' + _path + '  key= ' + _key +
                 '  data= ' + _data.name + '/' + _data.score);
  writeStatus = "waiting";
  firebase.database().ref(_path+'/' + _key).set(_data, function(error){
    if(error) {
      writeStatus = "failure";
      console.log(error);
    } else {
      if(_path == "Users"){
        var details = {
          username: userDetails.username,
          uid: userDetails.uid,
          score: 0
        };
        fb_writeRec(BB, userDetails.uid, details);
        writeStatus = "OK";
      } else if(_path == "Scores"){
        var adminDetails = {
          username: userDetails.username,
          uid: userDetails.uid,
          admin: 'n'
        };
        console.log("admin");
        document.getElementById("username").innerHTML = "Username: "+_data.username;
        document.getElementById("highscore").innerHTML = "High score: "+_data.score;
        fb_writeRec(ADMIN, userDetails.uid, adminDetails);
      } else {
        
        int_changeScreen("registrationPage", "gamePage");
      }
    }
  });
}

/*****************************************************/
// fb_readAll(_path, _data, _processAll)
// Read all DB records for the path
// Input:  path to read from and where to save it and function to process the data received
// Return: all db records
/*****************************************************/
function fb_readAll(_path, _data, _processAll) {
  console.log('fb_readAll: path= ' + _path);

  readStatus = "waiting";
  firebase.database().ref(_path).once("value", gotRecord, readErr);

  function gotRecord(snapshot) {
    if(snapshot.val() == null) {
      readStatus = "no record";
    }
    else {
      readStatus = "OK";
      let dbData = snapshot.val();
      console.log(dbData);
      let dbKeys = Object.keys(dbData);
      _processAll(_data, snapshot, dbKeys);
    }
  }
  function readErr(error) {
    readStatus = "fail";
    console.log(error);
    _processAll(_data, snapshot, dbKeys);
  }
}

/*****************************************************/
// fb_readRec(_path, _key, _data, _processData)
// Read a specific DB record
// Input:  path & key of record to read, where to save it, process function for the data
// Return: details of the path being read 
/*****************************************************/
function fb_readRec(_path, _key, _data, _processData) {	
  console.log('fb_readRec: path= ' + _path + '  key= ' + _key);
  readStatus = "waiting";
  
  firebase.database().ref(_path+'/' + _key).once("value", gotRecord, readErr);

  function gotRecord(snapshot) {
    let dbData = snapshot.val();
    if(dbData == null) {
      readStatus = "no record";
      console.log(_data)
      _processData(dbData, _data);
    }
    else {
      readStatus = "OK";
      console.log(_data)
      _processData(dbData, _data);
    }
  }
  function readErr(error) {
    readStatus = "fail";
    console.log(error);
  }
}

function fb_leaderboard() {
  dbArray = [];
  fb_readAll(BB, dbArray, fb_processAll);
}

/*****************************************************/
// fb_processLoginData(_dbData, _data)
// process the data of a user logging in
// Input: user's details and array for the details to be put inside
// Return: n/a
/*****************************************************/
/*/*/
function fb_processLoginData(_dbData, _data) {
  console.log("processData: ");
  console.log(_dbData)
  if(_dbData == null) {
    int_changeScreen("startScreen", "registrationPage");
    reg_beginRegister();
  } else {
    int_changeScreen("startScreen", "gamePage");
    if(_data.score == null && _data.admin == null){
      _data.uid = _dbData.uid;
      _data.name = _dbData.name;
      _data.email = _dbData.email;
      _data.photoURL = _dbData.photoURL;
      _data.username = _dbData.username;
      console.log("process username. username: "+_dbData.username);
      document.getElementById("username").innerHTML = "Username: "+_data.username;
      console.log(document.getElementById("username").innerHTML);
      fb_readRec(BB, userDetails.uid, userScore, fb_processLoginData);
    } else {
      if(_data.admin == null){
        _data.score = _dbData.score;
        document.getElementById("highscore").innerHTML = "High score: "+_data.score;
        fb_readRec(ADMIN, userDetails.uid, userAdmin, fb_processLoginData);
      } else {
        if(_dbData.admin === "y") {
          console.log("admin login");
          document.getElementById("b_lpAdmin").style.display = "block";
        } else {
          console.log("not admin user");
          console.log(_dbData);
          console.log(_data);
        }
      }
      console.log("process score. score: "+_dbData.score);
      
    }
  }
  console.log("finished processing data");
}

var leaderboardNames = [];

/*****************************************************/
// fb_processAll(_data, dbData, dbKeys)
// process all the data of a db table
// Input: array for the details to go inside, array containing the details, keys of the data
// Return: n/a
/*****************************************************/

function fb_processAll(_data, _dbData, _dbKeys) {
  _dbData = _dbData.val();
  for(i=0; i < _dbKeys.length; i++) {
    let key = _dbKeys[i];
    dbArray[i] = _dbData[key].score;
    leaderboardNames[i] = _dbData[key].username;
  }

  for (var i = 1; i < dbArray.length; i++){
    for (var j = 0; j < i; j++){
        if (dbArray[i] > dbArray[j]) {
          var names = leaderboardNames[i];
          leaderboardNames[i] = leaderboardNames[j];
          leaderboardNames[j] = names;
           
          var scores = dbArray[i];
          dbArray[i] = dbArray[j];
          dbArray[j] = scores;
        }
    }
  }
  for (var i = 0; i < dbArray.length; i++) {
    document.getElementById("leaderboardNames").innerHTML = 
document.getElementById("leaderboardNames").innerHTML+"<br>#"+(i+1)+" "+(leaderboardNames[i]);
    document.getElementById("leaderboardScores").innerHTML = 
document.getElementById("leaderboardScores").innerHTML+"<br>"+(dbArray[i]);
  }
    console.log(leaderboardNames);
    console.log(dbArray);
}
/*****************************************************/
//    END OF MODULE
/*****************************************************/