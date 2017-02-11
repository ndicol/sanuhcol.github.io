$(document).ready(function(){
  var arr = ["#aboutMe", "#projects", "#contacts"];
  var arrVal = ["AboutMe", "Projects", "Contacts"];
  
(function showFrstWindow(){
  var viewer =  $(window).height();
  $(".welcomeSection").css("height", viewer*0.8);
  $(".welcomeSection").css("padding-top", viewer*0.10);
  $(".welcomeSection").css("padding-bottom", viewer*0.10);
})();
  

var flashIntval;
(function displayLine(){
  var i = 1;
  var time = 1000;
  setTimeout(function(){
    clearInterval(showInterval);
    $("#arrowShow").html("&#x261F;");
    $("#arrowShow").css("color", "#B4B5B7");
    arrowIsShown();
  },4000);
  
var showInterval = setInterval(function(){
  welcome = "#welcome" + i;
    if(i === 1){
      time += 1000;
    }else{
      time = 2000;
    }
  $(welcome).fadeIn(2000);
  i++;
  }, time);
  $("#aboutMe").css("visibility", "visible");
})();
  

var count = 0;
function arrowIsShown(){
 flashIntval = setInterval(function(){
  if (count === 0){
    $("#arrowShow").fadeIn(500);
    count = 1;
  }else{
    $("#arrowShow").fadeOut(500);
    count = 0;
  }
 }, 1000);
}; 
  
function getEltHeight(elmt){
  var eletPos = {};
    eletPos.top = $(elmt).offset().top; //the top postion of the element
    eletPos.bottom = eletPos.top + $(elmt).outerHeight(); //bottom position of element
 return eletPos.top;
}
  
function getEltTop(elmt){
  var eletPos = {};
    eletPos.top = $(elmt).offset().top; //the top postion of the element
    eletPos.bottom = eletPos.top + $(elmt).outerHeight(); //bottom position of element
 return eletPos.bottom; 
}
  
$(window).scroll(function(){
  var floater = {};
    floater.top = $("#floater").offset().top;
    floater.bottom = floater.top + $("#floater").outerHeight();
  for(var i = 0; i < arr.length; i++){
    if (floater.top <= getEltTop(arr[i]) && floater.top >= getEltHeight(arr[i])){
      $("#floater>#val").text(arrVal[i]);
      return;
    }
  $("#floater>#val").text("Welcome");
  }
});
  
  
});