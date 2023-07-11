// api url for getting longitude and latitude
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=6a9214a29813211a9333c8fd3faf05f4

// api url for using longitude and latitude to actually get weather
// http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=6a9214a29813211a9333c8fd3faf05f4

// api url for current weather
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=6a9214a29813211a9333c8fd3faf05f4

var searchIn = document.querySelector("#search-input");
var searchBtn = document.querySelector("#search-btn");

// current-emoji
// current-humidity-text
// current-wind-text
// current-temp-text


function getWeather(lat, lon){
    // triggered when the user input was successfully converted to lat lon value (convertToGeo)
    // uses lat lon value to retrieve data from api url
    // looks for the weather values from the data retrieved (wind, humidity, temp, rain sunny etc)
    // adds the value to the corresponding cards in html
        // use queryselector to select all classes for each date, emoji, wind, humidity, temp
        // if its sunny, change the emoji to sunny, rainy then rain etc

    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6a9214a29813211a9333c8fd3faf05f4&units=metric`
    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        // calls to get weather forecast
        getWeatherForecast(lat, lon);
        // selectors to modify contents
        var currentWeatherDt = document.querySelector(".current-weather-date");
        var currentHumid = document.querySelector(".current-humidity-text");
        var currentWind = document.querySelector(".current-wind-text");
        var currentTemp = document.querySelector(".current-temp-text");
        var currentEmoji = document.querySelector(".current-emoji");
        var cityName = document.querySelector("#city-name");

        // convert unix time to actual time
        var realTime = dayjs(data.dt).format("MMM-D, dddd");

        cityName.textContent = data.name;
        currentWeatherDt.textContent = realTime;
        currentHumid.textContent = data.main.humidity;
        currentWind.textContent = data.wind.speed;
        currentTemp.textContent = data.main.temp;
        currentEmoji.textContent = data.weather[0].icon;
        

        console.log("current weather ", data);
    })
    
}

function getWeatherForecast(lat, lon){
    // triggered when the current weather got fetched and displayed
     // adds the value to the corresponding cards in html
        // use queryselectorall to select all classes for each date, emoji, wind, humidity, temp
        // use for loop to change the content to the data retrieved from the server api
        // if its sunny, change the emoji to sunny, rainy then rain etc
    
    var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=6a9214a29813211a9333c8fd3faf05f4&units=metric`
    fetch(requestUrl)
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        // setting variables to modify
        var weatherDates = document.querySelectorAll(".weather-date");
        var emoji = document.querySelectorAll(".emoji");
        var winds = document.querySelectorAll(".wind-text");
        var humiditys = document.querySelectorAll(".humidity-text");
        var temperatures = document.querySelectorAll(".temp-text");
        // iterating through data.list to find right data
        var dataTracker = 0;
        for(var i = 0; i < weatherDates.length; i++){
            weatherDates[i].textContent = dayjs(data.list[dataTracker].dt_txt).format("MMM-D, ddd");
            winds[i].textContent = data.list[dataTracker].wind.speed;
            humiditys[i].textContent = data.list[dataTracker].main.humidity;
            temperatures[i].textContent = data.list[dataTracker].main.temp;
            emoji[i].textContent = data.list[dataTracker].weather[0].icon;
            // since every 8th index is the next day date
            dataTracker += 8;
        }
    
        console.log("weather data: ", data.list);
    })
}

function convertToGeo(){
    // triggered when the user clicks on the search btn
    // gets the value from the user input
    // adds the value to the search history
    // checks if what user entered was empty or blank space (trim)
    // convert the user entered search input to longitude and latitude by using geo api
    // after getting the right data, call getWeather function with the acquired values => getWeather(lat, lon) 

    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchIn.value}&limit=1&appid=6a9214a29813211a9333c8fd3faf05f4&units=metric`;
    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log("geo data: ", data)
        var latitude = data[0].lat;
        var longitude = data[0].lon;
        getWeather(latitude, longitude);
    })


}

function saveHistories(){
    
}

// on click, call convertToGeo and saves histories
searchBtn.addEventListener("click", function(){
    saveHistories();
    convertToGeo()
})