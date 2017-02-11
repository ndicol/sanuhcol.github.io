$(document).ready(function(){
  
  (function initText(){
    $("#text").text("");
  })();
  
	var numReturnResult = 20; //number of returned result
	var searchText="";
	
	//asign searched text to a variable
	$('#text').on("input", function(){
    searchText = $("#text").val(); 
});

$("#text").on("keypress", function(e){
	if(e.keyCode===13){
		displayResult();
	}
});
	
$("#submit").on("click", function(){
	displayResult();
});

function displayResult(){
		if (searchText === ""){ //check textbox contains text
			return //alert("insert a valid search phrase!");
		}
		// asign url to a variable
		var url="https://en.wikipedia.org/w/api.php?action=opensearch&search="+searchText+"&limit="+numReturnResult+"&format=json&callback=?";
	$("#searchResult").html("");
		// piped API data from wikipedia using ajax
	$.ajax({
		url : url,
		dataType : "json",
		success : function(data){
			
			var wiki=""; //variable to construct returned searches
			//iterate elements in return array - currently 4 outer array elements
			for(var j = 0; j < numReturnResult; j++){ 
                for (var i = 1; i < data.length; i++){
                    if(i < 3){          // construct returned paragraph
					wiki += "<p>"+data[i][j] + "</p>";
				}else {														// construct the return link
					var links = data[i][j];
					wiki += "<p><a href="+data[i][j]+" target=\"_blank\">"+data[i][j]+"</a></p>"; 																	
						}
          }
         //print each element in a new div
				$("#searchResult").append("<div class=\"display\" \"col-centered\"  >"+wiki+"</div>");									
				wiki =""; //reset wiki else further clicks just keeps appending
        }
		}
	});
		
	}
});