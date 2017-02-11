$(document).ready(function (){
  var sessionTime = 1500000; //hold session interval
  $("#sessionDisplay").val( sessionTime/60000 + " min"); //display default session time
  var breakTime = 300000; //hold break interval
  $("#breakDisplay").val(breakTime/60000 + " min");//dispaly default break
  var timeout; //hold timeout to call timecalculation and display
  var timeInt;
  var pomodoroTime = 1500000; 
  var remainingTime = 1500000;
  var fixTime = 0; //holds remaining time taking into account when the start button is click from when it was pause
  var count = 0;
  
//audio alement to sound when break is reached
var alarmElement = document.createElement("audio");
    alarmElement.setAttribute("src", "./audio/smokeAlarm.mp3");
    alarmElement.volume = 0.1;

 // calculates the remaining time after each timeout and call display function
function calDisplayTime() {
    var today = new Date();
    var todayInt = today.getTime(); //holds current time in integer
    remainingTime = fixTime - todayInt; 
   //display time only between the session or break
   //alert when break is reached
    if (remainingTime > 0){
        displayTime(remainingTime);
      timeout = setTimeout(calDisplayTime, 1000);
    }else{
        $("#screen-time").val("Break!!");
       //sound alert only once
        soundAlarm();
    }
          
}
  
//sound alarm
function soundAlarm(){
  timeInt= setInterval(function(){
    alarmElement.play();
  }, 250);
  setTimeout(function(){
    clearInterval(timeInt);
  }, 8000);
}
   
 //adds 0 to single digits.   
function checkDoubleDigits(d){
    return (d < 10) ? ("0" + d) : d;
}
 
   //diplay function called by change  buttons to display session or break that is being set.
function displayTime(timeVal){
if(timeVal > -1){
    var sec = Math.floor((timeVal/1000)%60);
    var min = Math.floor((timeVal/(1000*60))%60);
    var hr = Math.floor((timeVal/(1000*60*60))%24);
    min = checkDoubleDigits(min);
    sec = checkDoubleDigits(sec);
    hr = checkDoubleDigits(hr);
    $("#screen-time").val(min + ":" + sec);
    }else{
        $("#screen-time").val("Invalid n.");
    }
}
 
  //stop (pause) diplay by clearing calDisplayTime's timeout call 
function stopDisplay(){
  clearTimeout(timeout);
  clearInterval(timeInt);
  count = 2;
}
 
  //accepts values from various buttons to set the pomodoro time
function updatePomodoroTime(val){
  pomodoroTime = val;
}
//if any button is clicked a switch statement used to identify the id and execute the correct statements    
$(".set-time-btn").on("click", function(){
  stopDisplay();
  switch ($(this).attr("id")) {
    case "add-session" :
      if(sessionTime <= 3570000){
      sessionTime += 300000;
      var min = sessionTime/(1000*60);
      $("#sessionDisplay").val( min + " min");
      updatePomodoroTime(sessionTime);
      displayTime(sessionTime);
      }
      break;
    case "reduce-session" :
      if (sessionTime > 300000){
        sessionTime -= 300000;
        var min = sessionTime/(1000*60);
        $("#sessionDisplay").val( min + " min");
        updatePomodoroTime(sessionTime);
        displayTime(sessionTime);
      }
    break;
    case "add-break" :
      if (breakTime < 1200000){
        breakTime += 60000;
        var min = breakTime/(1000*60);
        $("#breakDisplay").val(min + " min");
        updatePomodoroTime(breakTime);
        
      }
    break;
    case "reduce-break" :
      if (breakTime >60000){
        breakTime -= 60000;
        var min = breakTime/(1000*60);
        $("#breakDisplay").val(min + " min");
        updatePomodoroTime(breakTime); 
      }
      break;
  }
});

 //if any of the control button (start, stop reset) is clicked a switch statement used to identify the id and execute the correct statements
//starts countdown  

var startOn = 0;
$("#start").on("click", function(){
       $("#stop").css("background-color", "#A55667");
      $(this).css("background-color", "#382FF5");
      fixTime = parseInt(pomodoroTime) + new Date().getTime();
      calDisplayTime();
});
  
//stop or pause the clock
$("#stop").on("click", function(){
  stopDisplay();
  $(this).css("background-color", "#F81638")
  $("#start").css("background-color", "#505b8e");
});
 
 
   //maintain the display during stop/pause
$("#stop").on("focusout", function(){
    var stopTime = remainingTime;
    updatePomodoroTime(stopTime);
  });
  
//reset all time
$("#reset").on("click", function(){
  $("#start").css("background-color", "#505B8E");
  $("#stop").css("background-color", "#A55667");
  stopDisplay();
  //po
  updatePomodoroTime(sessionTime);
  displayTime(sessionTime);
  flashLight(1);
});
  
           
});