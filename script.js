// When the application starts, retrieve the search history from localStorage
// and populate that section of the page.
//
// If the operator types a city name into the search field.
//   - construct a search URL for that city
//   - pass the URL to the first fetch (current forecast to retrieve the lat/long)
//   - parse the lat/long out of the response, construct a new URL for the OneCallAPI
//   - pass the new URL to the fetchForecast function.
//   - if the response comes back successfully, add the second URL to the search history
//
// If the user clicks on a city name in the search history:
//   - retrieve the previously-saved URL for that city from the search history and 
//     pass it to the fetchForecast function.
//
// Structure for localStorage is just an object.
//    { cityID:OneCallAPIUrl, cityname:OneCallAPIUrl, ... }
//
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={YOUR API KEY}

var openweathermapApiKey = '60fa35f6a0783d15c0467e7b0b081c27';
var unitsPref = 'imperial';
var unitsChar = '&degF';
var cityInputEl = document.querySelector("#cityForm");
const localStorageKey = 'weatherData';
var searchHistory;

// Make sure that the user actually typed something before calling the API.
function validateSearchCriteria(e) {
    e.preventDefault();
    var cityName = document.querySelector("#cityText").value.trim();
    //cityName = cityName.trim();
    if (cityName !== '') {
        fetchCurrentWeather(cityName);
    }
}

// Call the current weather API to verify that the city name is one that will be found
// and to retrieve the latitude and longitude so that we can call the oneCallAPI for ALL
// the required weather info.
function fetchCurrentWeather(cityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?'
        + 'q=' + cityName
        + '&appid=' + openweathermapApiKey
    )
        .then(function (response) {
            if (response.status !== 200) {
                // report an error to the user   (TBD)
                console.log('There was some kind of a problem:  Status Code: ' + response.status);
                return;
            }

            response = response.json()
            response.then(function (data) {
                var cityLat = data.coord.lat;
                var cityLong = data.coord.lon;
                var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?'
                    + 'lat=' + cityLat
                    + '&lon=' + cityLong
                    + '&units=' + unitsPref
                    + '&exclude=minutely,hourly'
                    + '&appid=' + openweathermapApiKey
                fetchFutureForecast(cityName, oneCallUrl);
            });
        })
        .catch(function (err) {
            // Display a "fail" message to the user.  (TBD)
            console.log('weather API error: ' + err);
        });
}

// Call the oneCall API to retrieve all the weather info required for display.
function fetchFutureForecast(cityName, oneCallUrl) {
    fetch(oneCallUrl)
        .then(function (response) {
            if (response.status !== 200) {
                // report an error to the user  (TBD)
                console.log('oneCallAPI problem:  Status code: ' + response.status);
                return;
            }

            response = response.json();
            response.then(function (data) {
                populatePage(cityName, data);
            });
        })
        .catch(function (err) {
            // Display a "fail" message to the user.  (TBD)
            console.log('oneCallAPI error: ' + err);
        });
}

// Capitalize the first letter of each part of the city name.
function capitalizeCityName(cityName) {
    var tokens = cityName.split(' ');
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].length === 1) {
            tokens[i] = tokens[i].toUpperCase();
        } else {
            tokens[i] = tokens[i].charAt(0).toUpperCase() + tokens[i].substring(1).toLowerCase();
        }
    }
    return tokens.join(' ');
}

// This is  basic  to outline how to pull and display the data.
// Needs to be set up with correct elements in the html and accompanying .css
function populatePage(cityName, data) {
    // console.log(cityName);

    cityName = capitalizeCityName(cityName);
    // This is for functional requirements
    var currForecastArea = document.querySelector('#curr-forecast-container');
    var dateOut = moment.unix(data.current.dt);
    var cf = '';
    cf += '<h2>' + cityName + ' (' + moment.unix(data.current.dt).format('L') + ')' + '</h2>';
    cf += "<img src='https://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png'>";
    cf += '<p>' + 'Temperature: ' + data.current.temp + unitsChar + '</p>';
    cf += '<p>' + 'Humidity: ' + data.current.humidity + '%' + '</p>';
    cf += '<p>' + 'Wind Speed: ' + data.current.wind_speed + ' MPH' + '</p>';
    cf += '<p>' + 'UV Index: ' + data.current.uvi + '</p>';
    currForecastArea.innerHTML = cf;

    var futureForecastArea = document.querySelector('#future-forecast-container');
    var ff = '';
    for (var d = 0; d < 5; d++) {
        ff += '<p>' + 'Date: ' + moment.unix(data.daily[d].dt).format('L') + '</p>';
        ff += "<img src='https://openweathermap.org/img/w/" + data.daily[d].weather[0].icon + ".png'>";
        ff += '<p>' + 'Temp: ' + data.daily[d].temp.day + unitsChar + '</p>';
        ff += '<p>' + 'Humidity: ' + data.daily[d].humidity + '%' + '</p>';
    }
    futureForecastArea.innerHTML = ff;
}
cityInputEl.addEventListener('submit', validateSearchCriteria);


function recallSearchHistory() {
    searchHistory = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    showItem();
}

function updateSearchHistory(savedCityName) {
    if (!searchHistory.includes(savedCityName)) {
        searchHistory.push(savedCityName);
        localStorage.setItem(localStorageKey, JSON.stringify(searchHistory));
        showItem();
    }

}



function showItem() {
    var ul = document.getElementById("searchOfCities");
    // Display users and messages in the browser
    for (var i = 0; i < searchHistory.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = searchHistory[i];
        ul.appendChild(li);
    }
}
recallSearchHistory();