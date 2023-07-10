// api url for getting longitude and latitude
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=6a9214a29813211a9333c8fd3faf05f4

// api url for using longitude and latitude to actually get weather
// http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=6a9214a29813211a9333c8fd3faf05f4

var searchIn = document.querySelector("#search-input");
var searchBtn = document.querySelector("#search-btn");

function getWeather(lat, lon){
    // triggered when the user input was successfully converted to lat lon value (convertToGeo)
    // uses lat lon value to retrieve data from api url
    // looks for the weather values from the data retrieved (wind, humidity, temp, rain sunny etc)
    // adds the value to the corresponding cards in html
        // use queryselectorall to select all classes for each date, emoji, wind, humidity, temp
        // use for loop to change the content to the data retrieved from the server api
        // if its sunny, change the emoji to sunny, rainy then rain etc
    var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&appid=6a9214a29813211a9333c8fd3faf05f4`
    fetch(requestUrl)
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        var weatherDates = document.querySelectorAll(".weather-date");

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

    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchIn.value}&limit=1&appid=6a9214a29813211a9333c8fd3faf05f4`;
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

searchBtn.addEventListener("click", convertToGeo)