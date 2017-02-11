$(document).ready(function(){
$("#info").val("Game On!!!");
//global variables
var count = 0; // records turn of play
var level = 4; // default level of deficulties
var arrRemain = []; //holds remaianing cells (ie cells that are playable)
var arrMirrorBoard = []; // hod's mirror image of playboard


//default values
playerSymbol = "X"
computerSymbol = "O";
  
//selects sysmbol to use for computer and player
$("#selectSymbol").on("click", function(){
  playerSymbol = document.getElementById("selectSymbol").value;
  computerSymbol = (playerSymbol === "X") ? "O" : "X";
});
  
//selects level of difficulty... 0 -> easy, 4 -> impossible to win
$("#selectLevel").on("click", function(){
  level = document.getElementById("selectLevel").value;
});

var success = document.createElement("audio");
    success.setAttribute("src", "https://dl.dropbox.com/s/26p00k75jr5xkr1/success.mp3?dl=0");
    success.volume = 0.3;

//innitialise all arrays and   
(function init(){
  controlArray();
  updateRemain();
})(); 
  
//to reset game at any point
$("#reset").on("click", function(){
  gameOver();
});

//perform operations of gameover
//initialise arrays, counters, clear table,display game on
function gameOver(){
  arrRemain = [];
  arrMirrorBoard = [];
  clearTable();
  controlArray();
  updateRemain();
  level = document.getElementById("selectLevel").value;
  $("#info").val("Game On!!!");
  count = 0;
}
  

//innitialise array representing the play board
//set values of all cells to ""
function controlArray(){
  var rowLength = document.getElementById("isTable").rows.length;
    for (var j = 0; j < rowLength; j++){
      arrMirrorBoard[j] = ["", "", ""];
    } 
}
 
//Clear play board ... called by gameOver and init()
function clearTable(){
  for (var r = 1; r < 10; r++){
     var b = "#"+r;
    $(b).text("");
  }
  count = 0;
}

//updated playable cells
function updateRemain(){
  for (var r = 1; r < 10; r++){
     var b = "#"+r;
    if ($(b).text() === ""){
      arrRemain.push(b);
      }
  }
}

//displays notifications ... Win, Draw, Tie, Gameover
function winnerDef(symbol){
var announce;
  if (symbol === playerSymbol){
    announce = "You Won!!!"
    notifyWin(announce);
  }else if (symbol === computerSymbol){
    announce = "Computer Won!!!";
    notifyWin(announce);
  }else{
    announce = "It's a Tie !!!";
    notifyWin(announce);
  }
}

function notifyWin(str){
var timeInt; //time iterval for flashing winning
timeInt = setInterval(function(){
    if($("#info").val() === str){
      $("#info").val("");
    }else{
      $("#info").val(str);
    }
  },250);
setTimeout(function(){
  success.play();
}, 1000);
  
setTimeout(function(){
    clearInterval(timeInt);
    gameOver();
  }, 3000);
} 

  
//random generate of moves from available (playable) cells
function generateNum(){ 
  var gen =  Math.floor(Math.random() * arrRemain.length - 1) + 1;
  var val = arrRemain[gen];
  return val + " " + computerSymbol;
} 

//manages all internal arrays, display ofgames and check for winner
function displayAndStoreMoves(id, sym){
  $(id).text(sym);
  var cellInd = $(id)[0].cellIndex;
  var rowInd = $(id)[0].parentNode.rowIndex;
  arrMirrorBoard[rowInd][cellInd] = sym;
  
    var indexVal = arrRemain.indexOf(id);
    arrRemain.splice(indexVal, 1);
  count++;
  checkWinner();
}

// manages computer's moves and set the level of difficulties of game
// count is used to know players turn, but also to know when gameove ie count >9
function passMoveToComputer(){
  if(count % 2 === 1 && count < 9){
    var idValue;
    var sym;
    var move;
    // set level of game. default = 4
    switch(level){
        case "4": 
        move = getmove();
        break;
      case "2":
        move = blockMove();
        break;
      case "0":
        move = generateNum();
        break;
      default:
        move = getmove();  
    }
      idValue = move.split(" ")[0];
      sym = move.split(" ")[1];
      setTimeout(function(){
        displayAndStoreMoves(idValue, sym);
      },500);
      
  }else {
    winnerDef();
  } 
}

//functions to check if horizonal win exist
function checkHorizontal(){
    looping: for (var i = 0; i < 3; i ++){
       for (var k = 1; k < 3; k++){
        if (arrMirrorBoard[i][0] !== arrMirrorBoard[i][k] || arrMirrorBoard[i][k] === ""){
          if (i < 2){
            continue looping;
          }else{
            return checkVertical();
          }
          
        }
      }
      return winnerDef(arrMirrorBoard[i][0]);
    }
  }

//functions to check if vertival win exist  
function checkVertical(){
    looping: for (var n = 0; n < 3; n++){
       for (var m = 1; m < 3; m++){
        if (arrMirrorBoard[0][n] !== arrMirrorBoard[m][n] || arrMirrorBoard[m][n] === ""){
          if(n < 2){
            continue looping;
          }else {
            return checkDiagonal();
          }
          
        }
      } 
    return winnerDef(arrMirrorBoard[0][n]);
      
    }
  }

//functions to check if Diagonal win exist
function checkDiagonal(){
   for (var i = 1; i < 3; i++){
    if (arrMirrorBoard[0][0] !== arrMirrorBoard[i][i] || arrMirrorBoard[i][i] === ""){
    return diagMoving();
    }
  }
  return winnerDef(arrMirrorBoard[0][0]);
}

function diagMoving(){
  for (var i = 0, p = 2; i < 3; p--, i++){
    if (arrMirrorBoard[1][1] !== arrMirrorBoard[i][p] || arrMirrorBoard[i][p] === ""){
    return;
    }
  }
  return winnerDef(arrMirrorBoard[1][1]);
} 


//function calledto check winner
//only checkHorizontal() is calle. vert and diag may be call cascadingly if no winner is found
function checkWinner(){
  checkHorizontal();
} 

//get moves for computer's game
//divied according to priority: Win, Block opponent from winning, Less strategy, and just gerating completely random moves

/* *** Priority 4: to win *** */
//Horizontal
  function getmove(){
for (var i = 0; i < 3; i++){
  if (arrMirrorBoard[i][0] === computerSymbol && arrMirrorBoard[i][1] === computerSymbol && arrMirrorBoard[i][2] === ""){
    arrMirrorBoard[i][2] = computerSymbol;
    
    var x = document.getElementById("isTable").rows[i].cells[2];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
    
  }else if (arrMirrorBoard[i][0] === computerSymbol && arrMirrorBoard[i][2] === computerSymbol && arrMirrorBoard[i][1] === ""){ 
    arrMirrorBoard[i][1] = computerSymbol;
    
    var x = document.getElementById("isTable").rows[i].cells[1];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
    
  }else if (arrMirrorBoard[i][1] === computerSymbol && arrMirrorBoard[i][2] === computerSymbol && arrMirrorBoard[i][0] === ""){
    arrMirrorBoard[i][0] = computerSymbol;
    
    var x = document.getElementById("isTable").rows[i].cells[0];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
    }
  }
  return vertMoves();
}
    
//Vertical
function vertMoves(){
for(var j = 0; j < 3; j++){
    if (arrMirrorBoard[0][j] === computerSymbol && arrMirrorBoard[1][j] === computerSymbol && arrMirrorBoard[2][j] === ""){
    arrMirrorBoard[2][j] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[2].cells[j];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
      
    }else if (arrMirrorBoard[0][j] === computerSymbol && arrMirrorBoard[2][j] === computerSymbol && arrMirrorBoard[1][j] === ""){
    arrMirrorBoard[1][j] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[1].cells[j];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
      
    }else if (arrMirrorBoard[1][j] === computerSymbol && arrMirrorBoard[2][j] === computerSymbol && arrMirrorBoard[0][j] === ""){
    arrMirrorBoard[0][j] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[0].cells[j];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
    }
  }
  return diagMoves();
}  
  
//diagonal
function diagMoves(){
  if (arrMirrorBoard[0][2] === computerSymbol && arrMirrorBoard[2][0] === computerSymbol && arrMirrorBoard[1][1] === ""){
    arrMirrorBoard[1][1] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[1].cells[1];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
  }else if (arrMirrorBoard[0][2] === computerSymbol && arrMirrorBoard[1][1] === computerSymbol && arrMirrorBoard[2][0] === ""){
    arrMirrorBoard[2][0] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[2].cells[0];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
  }else if (arrMirrorBoard[1][1] === computerSymbol && arrMirrorBoard[2][0] === computerSymbol && arrMirrorBoard[0][2] === ""){
    arrMirrorBoard[0][2] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[0].cells[2];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
  }
//second diagonal
  else if (arrMirrorBoard[2][2] === computerSymbol && arrMirrorBoard[1][1] === computerSymbol && arrMirrorBoard[0][0] === "" ){
    arrMirrorBoard[0][0] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[0].cells[0];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
  }else if (arrMirrorBoard[2][2] === computerSymbol && arrMirrorBoard[0][0] === computerSymbol && arrMirrorBoard[1][1] === ""){
    arrMirrorBoard[1][1] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[1].cells[1];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
  }else if (arrMirrorBoard[1][1] === computerSymbol && arrMirrorBoard[0][0] === computerSymbol && arrMirrorBoard[2][2] === ""){
    arrMirrorBoard[2][2] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[2].cells[2];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
  }
  return blockMove();
}
  
/* *** Priority 3: Block win *** */
//Horizontal
function blockMove(){
  /* Priority 2: avoid palyer wining */
for (let i = 0; i < 3; i++){
  if (arrMirrorBoard[i][0] === playerSymbol && arrMirrorBoard[i][1] === playerSymbol && arrMirrorBoard[i][2] === ""){
    arrMirrorBoard[i][2] = computerSymbol;
    
    var x = document.getElementById("isTable").rows[i].cells[2];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
    
  }else if (arrMirrorBoard[i][0] === playerSymbol && arrMirrorBoard[i][2] === playerSymbol && arrMirrorBoard[i][1] === ""){ 
    arrMirrorBoard[i][1] = computerSymbol;
    
    var x = document.getElementById("isTable").rows[i].cells[1];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
    
  }else if (arrMirrorBoard[i][1] === playerSymbol && arrMirrorBoard[i][2] === playerSymbol && arrMirrorBoard[i][0] === ""){
    arrMirrorBoard[i][0] = computerSymbol;
    
    var x = document.getElementById("isTable").rows[i].cells[0];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
    }
  }
  return vertBlock();
}

//Vertical
function vertBlock(){ 
for(var j = 0; j < 3; j++){
    if (arrMirrorBoard[0][j] === playerSymbol && arrMirrorBoard[1][j] === playerSymbol && arrMirrorBoard[2][j] === ""){
    arrMirrorBoard[2][j] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[2].cells[j];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
      
    }else if (arrMirrorBoard[0][j] === playerSymbol && arrMirrorBoard[2][j] === playerSymbol && arrMirrorBoard[1][j] === ""){
    arrMirrorBoard[1][j] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[1].cells[j];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
      
    }if (arrMirrorBoard[1][j] === playerSymbol && arrMirrorBoard[2][j] === playerSymbol && arrMirrorBoard[0][j] === ""){
    arrMirrorBoard[0][j] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[0].cells[j];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
    }
  }
  return diagBlock();
}
  
//diagonal
function diagBlock(){ 
  if (arrMirrorBoard[0][2] === playerSymbol && arrMirrorBoard[2][0] === playerSymbol && arrMirrorBoard[1][1] === ""){
    arrMirrorBoard[1][1] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[1].cells[1];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
  }else if (arrMirrorBoard[0][2] === playerSymbol && arrMirrorBoard[1][1] === playerSymbol && arrMirrorBoard[2][0] === ""){
    arrMirrorBoard[2][0] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[2].cells[0];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
  }else if (arrMirrorBoard[1][1] === playerSymbol && arrMirrorBoard[2][0] === playerSymbol && arrMirrorBoard[0][2] === ""){
    arrMirrorBoard[0][2] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[0].cells[2];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
  }
//second diagonal
  else if (arrMirrorBoard[2][2] === playerSymbol && arrMirrorBoard[1][1] === playerSymbol && arrMirrorBoard[0][0] === ""){
    arrMirrorBoard[0][0] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[0].cells[0];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
  }else if (arrMirrorBoard[2][2] === playerSymbol && arrMirrorBoard[0][0] === playerSymbol && arrMirrorBoard[1][1] === ""){
    arrMirrorBoard[1][1] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[1].cells[1];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
  }else if (arrMirrorBoard[1][1] === playerSymbol && arrMirrorBoard[0][0] === playerSymbol && arrMirrorBoard[2][2] === ""){
    arrMirrorBoard[2][2] = computerSymbol;
      
    var x = document.getElementById("isTable").rows[2].cells[2];
    var val = "#"+x.id;
    return(val + " " + computerSymbol);
  }
  return onePlay();
 }

/* *** Priority 2: to win *** */ 
//based on one move
  function onePlay(){
    if (arrMirrorBoard[0][0] === playerSymbol && arrMirrorBoard[2][2] === ""){
      arrMirrorBoard[2][2] = computerSymbol;
      var x = document.getElementById("isTable").rows[2].cells[2];
      var val = "#"+x.id;
      return(val + " " + computerSymbol);
      
    }else if (arrMirrorBoard[2][2] === playerSymbol && arrMirrorBoard[0][0] === ""){
      arrMirrorBoard[0][0] = computerSymbol;
      var x = document.getElementById("isTable").rows[0].cells[0];
      var val = "#"+x.id;
      return(val + " " + computerSymbol);
      
    }if (arrMirrorBoard[0][2] === playerSymbol && arrMirrorBoard[2][0] === ""){
      arrMirrorBoard[2][0] = computerSymbol;
      var x = document.getElementById("isTable").rows[2].cells[0];
      var val = "#"+x.id;
      return(val + " " + computerSymbol);
      
    }else if (arrMirrorBoard[2][0] === playerSymbol && arrMirrorBoard[0][2] === ""){
      arrMirrorBoard[0][2] = computerSymbol;
      var x = document.getElementById("isTable").rows[0].cells[2];
      var val = "#"+x.id;
      return(val + " " + computerSymbol);
      
    }
    return anyPlay();
  }

/* *** Priority 0: to win *** */
//based on zero move... completely random
  function anyPlay(){
    if (arrMirrorBoard[1][1] === ""){
      arrMirrorBoard[1][1] = computerSymbol;
      
      var x = document.getElementById("isTable").rows[1].cells[1];
      var val = "#"+x.id;
      return(val + " " + computerSymbol);
      
    }else if (arrMirrorBoard[0][0] === ""){
      arrMirrorBoard[0][0] = computerSymbol;
      
      var x = document.getElementById("isTable").rows[0].cells[0];
      var val = "#"+x.id;
      return(val + " " + computerSymbol);
      
    }else if (arrMirrorBoard[0][2] === ""){
      arrMirrorBoard[0][2] = computerSymbol;
      
      var x = document.getElementById("isTable").rows[0].cells[2];
      var val = "#"+x.id;
      return(val + " " + computerSymbol);
     
    }else if(arrMirrorBoard[2][0] === ""){
      arrMirrorBoard[2][0] = computerSymbol;
      
      var x = document.getElementById("isTable").rows[2].cells[0];
      var val = "#"+x.id;
      return(val + " " + computerSymbol);
      
    }else if(arrMirrorBoard[2][2] === ""){
      arrMirrorBoard[2][2] = computerSymbol;
      
      var x = document.getElementById("isTable").rows[2].cells[2];
      var val = "#"+x.id;
      return(val + " " + computerSymbol);
    }
    return generateNum(); //randome move generator
  }


// main click events. call necessary functions to check wind and pass game to computers
// count usedto validate turn. this.text empty is necessary avoid multiple clicks on same cell 
$("td").on("click", function(){
  if(count % 2 === 0 && $(this).text() === ""){
    var val = $(this).attr("id");
    val = "#"+ val;
    displayAndStoreMoves(val, playerSymbol)
    
    passMoveToComputer();
  }
 }); 
}); /*  **  Phew!!! this has been a hectic programming.**  */