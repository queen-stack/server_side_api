var getUserRepos = function(user) {
    // format the github api url
    // the API for the weather app: 
    //https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={YOUR API KEY}
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
  
    // make a request to the url
    fetch(apiUrl).then(function(response) {
      response.json().then(function(data) {
        console.log(data);
      });
    });
  };

  /*requirements
 search for a city in the US
Presented with today & future conditions for that city and that city is added to the search history
local storage
view current weather conditions for that city
presented with city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am presented with current and future conditions for that city

Actions - 
know that the images will be derived from the API


  