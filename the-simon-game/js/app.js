$(document).ready(function(){
var gameOn = 0;
var timeIntLight; //intervaal for flashing lights
var timeIntScreen; //interval for flsing display screen
var turn = 0;
var mode = null; // for strict (1) or normal (0) mode.
var light = 0; //light iterator preset to 0 makes sure at first call the the light is off
var displayInterval = 1250;//assign initial tempo of the game
var currLevel = 1;//level ofplay
var arrCurrGame = []; //stores generated machines's game
var arrCurrGameMirror =[]; //store player's game
  
//KEYSOUNDS
var q0 = document.createElement("audio");
    q0.setAttribute("src", "./sounds/simonSound1.mp3");
var q1 = document.createElement("audio");
    q1.setAttribute("src", "./sounds/simonSound2.mp3");
var q2 = document.createElement("audio");
    q2.setAttribute("src", "./sounds/simonSound3.mp3");
var q3 = document.createElement("audio");
    q3.setAttribute("src", "./sounds/simonSound4.mp3");
var fail = document.createElement("audio");
    fail.setAttribute("src", "./sounds/fail.mp3?dl=0");
    fail.volume = 0.5;
var success = document.createElement("audio");
    success.setAttribute("src", "./sounds/success.mp3?dl=0");
    success.volume = 0.3;
  

//display fixed displays
//concat 0 to elements that are < 10
function displayinfo(strToDisplay){
  if (strToDisplay < 10 && strToDisplay !== ""){
    strToDisplay = "0".concat(strToDisplay);
  }
  $("#numDisplay").val(strToDisplay);
}

//increase tempo of game at level 5, 9, and 13
function updateTempo(level){
  if(level === 5 || level === 9 || level === 13){
    displayInterval = Math.floor(displayInterval/1.2);
  }
}
  
//functions that flashes any text on the screen
function flashScreen(str, time){ 
  timeIntScreen = setInterval(function(){
    $("#numDisplay").val() === "" ? $("#numDisplay").val(str):$("#numDisplay").val("");
/*  if ($("#numDisplay").val() === ""){
  $("#numDisplay").val(str);
  }else{
      $("#numDisplay").val("");
  }  */
}, time);
} 

//initialise and start/restart game
function initGame(){
  turn = 0;//turn for computer to play
  gameOn = 1;
  light = 0;
  displayInterval = 1250;
  currLevel = 1;
  arrCurrGame = [];
  arrCurrGameMirror =[];
  computerPlay(); //pass game to computer
}

//display current level
// call generateGame to generate moves for current level
// call lightOnClick function to lightup buttons based on sequence of generated moves
function computerPlay(){
  if(turn === 0){
  clearInterval(timeIntScreen);
  displayinfo(currLevel); // display current level
  generateGame(currLevel);
  lightOnClick(arrCurrGame, displayInterval);
  
  }
}
  
// generates 4 randon ids and push them into the array mirroing the board  
function generateGame(a){
    for (var i = 0; i < a; i++){
      var num = Math.floor(Math.random()*4); 
      var idBtn = "#q" + num;
      if (idBtn === arrCurrGame[arrCurrGame.length - 1]){
		  generateGame(a)
      }else{
		  arrCurrGame.push(idBtn);
      }
  }
}

//generate altenate patten of lights using setInterval()
//setTimeout used to creat sync and number of display
//the preset "light" var mimics a for loop to loop all array currArray elements
function lightOnClick(A, intervalTime){
turn = 0;
  timeIntLight = setInterval(function(){
    if ($(A[light]).css("opacity") == 0.7){
       $(A[light]).css("opacity", 1);
      var lId = A[light].slice(1);
      playASound(A[light]);
    }else{
      $(A[light]).css("opacity", 0.7);
    }
  }, intervalTime/2);
  setTimeout(function(){
      clearInterval(timeIntLight);
      $(A[light]).css("opacity", 0.7);
      light++; 
      if(light < A.length && (gameOn) ){ //used to mimic a for-Loop; will exit after looping all array element
      lightOnClick(arrCurrGame, intervalTime);
    }else{
      //resets light ready for call from any function
      light = 0;
      //setTimeout(function(){
        
        turn = 1;
      //},intervalTime);
    } 
  }, intervalTime);
}
  
//checks if player's move is = computermove
//if both moves equal for all computermoves, then it is alevel win, and next level function is call
//else if at any mismstch, level is repeated if in normal mode and player notify
//if in strict mode, level is resets to 1 and player is notify
//if all moves are equal and and level = 9 (or < 10), then game is won, player is notified
function checkWinner(){
  if(turn === 0){
    for (var j = 0; j < arrCurrGameMirror.length; j++){
    if(arrCurrGame[j] !== arrCurrGameMirror[j]){
      if(mode === 1){
        playASound("fail");
        flashScreen("rpt", 250);
        setTimeout(function(){
        clearInterval(timeIntScreen);
        strictRepeatLevel();
        },2000);
        return;
      }else if(mode === 0){
        playASound("fail");
        flashScreen("rst", 250);
        setTimeout(function(){
        clearInterval(timeIntScreen);
        repeatLevel();
      },2000);
      return;
      }   
    }
  }
  if(arrCurrGameMirror.length == arrCurrGame.length){
    if(currLevel < 20){ 
      flashScreen("nxt", 400);
      setTimeout(function(){
      playASound("success");
      }, 1000);
      setTimeout(function(){
      clearInterval(timeIntScreen);
      nextLevel();
      },2000); 
    }else{
      flashScreen("won", 250);
      var intVar = setInterval(function(){
      playASound("success");
      }, 500);
      playASound("success");
      setTimeout(function(){
      clearInterval(intVar);
      clearInterval(timeIntScreen);
      initGame();
      },2000);
    }
  }else{
      turn = 1;
  }
  }
} 
  
//increment level and clear arrays
//call generateGame() to generate new values for next level
//increases speed of display by decreasing interval time
function nextLevel(){
    arrCurrGameMirror = [];
    currLevel = parseInt(currLevel) + 1;
    generateGame(1);
    displayinfo(currLevel);
    updateTempo(currLevel);
    setTimeout(function(){
    lightOnClick(arrCurrGame, displayInterval);
  },1000);
} 

//Stict repeat game
//Reset both corrent game moves and player's lastmove
//diplays failed level
function strictRepeatLevel(){
  displayinfo(currLevel);
  clearBoard();
  generateGame(currLevel);
  setTimeout(function(){
  lightOnClick(arrCurrGame, displayInterval);
  },1000);
} 

//repeats game by retaining corrent game moves while reseting player's lastmove
//diplays failed level (asigned to current Level)
function repeatLevel(){
  displayinfo(currLevel);
  arrCurrGameMirror = [];
  setTimeout(function(){
    lightOnClick(arrCurrGame, displayInterval);
  },1000);
} 
  
//clear arrays that holds moves (player and machine's)     
function clearBoard(){
  arrCurrGame = [];
  arrCurrGameMirror =[];
}
  
//play sound as called 
function playASound(val){
      switch(val){
        case "#q0":
          q0.play();
          break;
        case "#q1":
          q1.play();
          break;
        case "#q2":
          q2.play();
          break;
        case "#q3":
          q3.play();
          break;
        case "fail":
          fail.play();
          break;
        case "success":
          success.play();
          break;
    }
}
 
//accepts player clicks on any of the 4 buttons and register the sequence
//lights the button
//checks if the sequence matchesmachines
$(".quarter").on("click", function(){
  if(turn === 1){
  if(gameOn == 1 && $("#start").css("opacity") == 1){
    var id = $(this).attr("id");
    var idVal = "#" + id;
    arrCurrGameMirror.push(idVal);
    $(idVal).css("opacity", 1);
    playASound(idVal);
    setTimeout(function(){
      $(idVal).css("opacity", 0.7);
      turn = 0;
      checkWinner();
    }, 250);
    }
  }
});
  
//activates strictmode
$("#strict").on("click", function(){
  if(gameOn === 1){
     if (mode === 0){
        $(this).css("backgroundColor", "#F39C12");
        $("#start").css("backgroundColor", "#1B4F72");
       mode = 1;
      }
    }
});
  
//activates normal mode
// if not on , game is not playable
  var startCount = 0;
$("#start").on("click", function(){
    if(gameOn === 1){
        if (mode === null || mode === 1 || mode === 0){
            $(this).css("backgroundColor", "#3498db");
            $("#strict").css("backgroundColor", "#6E2E00");
            mode = 0;
            initGame();
        }
    }
});

//on machine
//call flashScreen() to flash "--" to indicate machine is ready
$("#onBtn").on("click", function(){
  if(gameOn === 0){
    $(this).css("opacity", 1);
    $("#numDisplay").css("backgroundColor", "#6B233D");
    flashScreen("--", 500);
    mode === null;
    gameOn = 1;
  }else{
    clearInterval(timeIntScreen); //clear display screen
    clearInterval(timeIntLight); //stops display lights
    $(this).css("opacity", 0.6);
    $("#numDisplay").val("");
    $("#numDisplay").css("backgroundColor", "#381623");
    displayinfo("");
    $("#start").css("backgroundColor", "#1b4f72");
    $("#strict").css("backgroundColor", "#6e2c00");
    gameOn = 0;
  } 
});
 
});