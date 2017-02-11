$(document).ready(function(){
  var calcIsOn = 0;
  var currValue = "";
  var memPlus = 0;
  var memAccum = 0;
  var accum = "";
  var operator = ""; 
  var countMinus = 0; //Holds count of Mem- clicked: stop Mem- from adding more than once
  var countPlus = 0; //Holds count of Mem+ clicked: stop Mem+ from adding more than once
    

function initScreen (){
    $("#textA").val("")
        currValue = "";
}
  
 
$("#on").on("click", function(){
    if (calcIsOn === 0){
       $("#textA").css("background-color", "#E4F2E8");
        $(this).css("background-color", "#f90438");
        $("#textA").val("");
        $("#textA").focus();
        $(".childButt").css("color", "#E1EAF7");
        calcIsOn = 1;
    }else{
        $("#textA").css("background-color", "#BED1C3");
        $(this).css("background-color", "chocolate");
        $(".childButt").css("color", "#CEC493");
        initScreen (); //clear screen
        memPlus = 0; //clear store value in Mem+ and Mem-
        accum = ""; //clear accumulator
        calcIsOn = 0; //off calculator
    }  
});
var currValueWithCommas
//display digis on the screen  
function addAndDisplay(b){
  currValue += b.toString();
 // currValueWithCommas = addCommas(currValue.toString());
  $("#textA").val(currValue);
}
  
  
//avaluate result on pressing "enter" button
$("#textA").on("keydown", function(event){
  var value = event.keyCode || event.which;
  if(value == 13){
    equalEvaluation();
    operator = "\=";
  }else if(value == 46){
    accum = "";
    initScreen();
  }else if(value == 8){
    currValue= currValue.toString().slice(0, currValue.length-1);
    $("#textA").val(currValue);
    accum = "";
    operator = "bkspc";
  }
});

//display appriorate user friendly sysmbols for operations
//adds current display values to accumulator and updates operation symbol
function performOperation(op){
  if(op == "\*"){
    $("#textA").val("x");
  }else if(op == "\/"){
    $("#textA").val("÷");
  }else{
     $("#textA").val(op);
  }
  operator = op;
  accum += currValue + operator;
  currValue = "";
}

//performs evaluation on pressing enter-key or or clicking eq-button
//Execute the Equal Operation. 
//repeat process every time clicked
//reset screen and screen text-holder 
function equalEvaluation(){
  accum = eval(accum + parseFloat(currValue)) || 0;
  var displ = 0;
    if (accum.toString().length > 13) {
      displ = accum.toPrecision(8);
    }else {
      //format number to local format
      displ = accum.toLocaleString(undefined, {maximumFractionDigits: 8});
    }
    $("#textA").val(displ);
     memAccum = accum;
    //accum = "";
    countPlus = 0;
    countMinus = 0;
    currValue = ""; 
}
/* OPERATION FROM KEYBOARD */
// input from keyboard
$("#textA").on("keydown", function(event){
  var value = event.keyCode || event.which;
  if(value >= 96 && value <= 111 ){
    if(value == 106){
        performOperation("\*");
        return false;
      }else if(value == 111){
        performOperation("\/");
        return false;
      }else if(value == 107){
        performOperation("\+");
        return false;
      }else if(value == 109){
        performOperation("\-");
        return false;
      }else if(value == 110){
        //call avoid multiple pts symbols for keyboard pt key 
        preventMultiPoints();
        return false;
      }else{
        if(operator === "\=" || operator === "bkspc"){
          accum = "";
        }
        addAndDisplay(event.key);
        return false;
      }
    }else{
      return false;
    }
});
  
/* OPERATIONS FROM CLICKING CALC BUTTONS */
  
//display input digits buttons 
$(".digitBtn").on("click", function(){
  if(calcIsOn){
    if(operator == "\="){
      accum = "";
    }
    addAndDisplay($(this).attr('id'));
  }
});

//avoid multiple pts symbols 
function preventMultiPoints(){
  if (currValue.indexOf("\.") === -1){
    if (currValue.length > 0){
      addAndDisplay(".");
    }else {
      addAndDisplay("0.");
    }  
  }
}
  
//call avoid multiple pts symbols for buttons 
 $("#pt").on("click", function(){
   preventMultiPoints()
});
   
 //clear screen and accumulator        
 $("#ce").on("click", function() {
        $("#textA").val("")
        accum = "";
        initScreen();
});

$("#textA").on("click", function(){
  if(calcIsOn){
    //accum = "";
    //initScreen();
  }else{
    return false;
  }
});
   
/*call performOperation() to Concatenate values and operator.*/
$("#plusBtn").on("click", function(){
    performOperation("\+");
}); 

$("#minusBtn").on("click", function(){
   performOperation("\-");
});
     
$("#times").on("click", function(){
   performOperation("\*");
});    
 
$("#divide").on("click", function(){
    performOperation("\/");
});

//Square operation. Evaluate value and display on screen.
//reset screen and screen text-holder
$("#sq").on("click", function(){
    accum = currValue * currValue;
    $("#textA").val(accum.toLocaleString(undefined, {maximumFractionDigits: 8}))
    currValue = "";
})

//Square root operation. Evaluate value and display on screen.
//reset screen and screen text-holder    
$("#sqrt").on("click", function(){
    accum = Math.sqrt(currValue);
    $("#textA").val(accum.toLocaleString(undefined, {maximumFractionDigits: 8}));
    currValue = "";
})

//Store or increment value in memory in an += logic
//Value is initialised to 0 at program-start
$("#addInMem").on("click", function(){
    if (countPlus === 0){ // to avoid continous addition
        memPlus += memAccum || 0;
        memAccum = 0;
        countPlus = 1;
    }  
});
   
//Display value stored in memory in an += logic 
// and assign value to currValue so operation could be be performed on it
$("#memRecall").on("click", function(){
    $("#textA").val(memPlus);
    currValue = memPlus;
});

//Decrement value in memory by value in display   
$("#minusMem").on("click", function(){
  if (countMinus = 0){
    memPlus -= $("#textA").val();
    countMinus = 1;
  } 
});

//call Equal operation to evaluate value and display on result.   
$("#eqBtn").on("click", function(){
  equalEvaluation();
  operator = "\=";
});    
    
});
