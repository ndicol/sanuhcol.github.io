$(document).ready(function(){

//Identify geo-location af browser and assigned to variable
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = (position.coords.latitude).toFixed(5);
    var long = (position.coords.longitude).toFixed(5);
    
 //concatenates WU API access, key, longetute and latitute for geolocation o local browser
    var weather = "https://api.wunderground.com/api/86053e18162226b3/geolookup/conditions/q/"+lat+","+long+".json" 

 // using ajax to retrive all weather data
  $.ajax({
  url: weather,
  dataType : "jsonp",
  success : function(data) {
  //asigning useful weather data to vriable (temp already in Far and Cel)
  var location = data.current_observation.display_location.full;
  var tempFah = data.current_observation.temp_f;
  var tempCel = data.current_observation.temp_c;
  var img = data.current_observation.icon_url;
  var description = data.current_observation.weather;
  var wind = data.current_observation.wind_string;
  var humidity = data.current_observation.relative_humidity
  
    //for testing display for different weather conditions
    // var description = "weather type goes here" 
  
//displaying local weather parameters
$("#location").append("<strong>"+" "+location+"</strong>");
$("#weatherDescription").html(description);   
$("#wind").html("Wind: " + wind);
$("#humidity").html("Humidity: " + humidity);
$("#temp").html("Temp: " + tempFah+" °F");
    
//buttons to view temp in celcius and fahrenheit
$("#celcius").on("click", function(){
    $("#temp").text("Temp: " + tempCel+ " °C");
   }); 
$("#fahrenheit").on("click", function(){
    $("#temp").text("Temp: " + tempFah+" °F");
   });
//concatenating weather icon attributes and diapay
$("#weatherIcon").html("<img src=" +img+" " +"alt= weather Icon>");

 //images from Unsplash site to be displayed on different weather conditions 
 var partlyCloud = "./wetherImages/partlyCloudy.jpg";
 var allTime = "./wetherImages/allTime.jpg";
 var foggy = "./wetherImages/foggy.jpg";
 var rainy = "./wetherImages/rainny.jpg"
 var snowy="./wetherImages/snowy.jpg";
 var clear = "./wetherImages/clear.jpg";
 
//switch statement to check weather discription and display background accordingly
 switch (description){
   case "Funnel Cloud":
   case "Partly Cloudy": 
   case "Mostly Cloudy": 
   case "Scattered Clouds":
     $("body").css("background-image", "url(" + partlyCloud + ")");
     $("body").css({"color": "#D4D4BC"});
     break;
   case "Mostly Sunny":				
   case "Partly Sunny":
   case "Clear":
   case "Sunny":
   $("body").css("background-image", "url(" + clear + ")");
   $("body").css({"color": "#995074"});
     break;
   case "Thunderstorm":	
   case "Rain Mist":
   case "Rain Showers":
   case "Overcast":	
   case "Scattered Clouds":
   case "Rain":
   $("body").css("background-image", "url(" + rainy + ")");
     $("body").css({"color": "#DEDD66"});
     break;
   case "Snow":
   case "Snow Grains":
   case "Ice Crystals":
   case "Ice Pellets":
     $("body").css("background-image", "url(" + snowy + ")");
     break;
   default:
     $("body").css("background-image", "url(" + allTime + ")");
 }
          }
      });
    });
  }
});