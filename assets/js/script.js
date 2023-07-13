// api url for getting longitude and latitude
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=6a9214a29813211a9333c8fd3faf05f4

// api url for using longitude and latitude to actually get weather
// http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=6a9214a29813211a9333c8fd3faf05f4

// api url for current weather
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=6a9214a29813211a9333c8fd3faf05f4

// image src for icons https://openweathermap.org/img/wn/{icon}.png

var searchIn = document.querySelector("#search-input");
var searchBtn = document.querySelector("#search-btn");
var searchHis = document.querySelector("#search-history")
var clearBtn = document.querySelector("#clear-btn");
var convertBtn = document.querySelector("#convert-btn");
var searchHisArr = [];

// variable to check if the user has loaded the weather at least once
var didLoad = false;

// variable for unit reference (celsius or fahrenheit)
var unitRef = document.querySelector("#unit-ref");


// if there is something in local storage, retrieve it and apply it to html
if(localStorage.getItem("history")){
    // parse it back for the array
    searchHisArr = JSON.parse(localStorage.getItem("history"));
    for(var i = 0; i < searchHisArr.length; i++){
        // create an element to append
        let historyEl = document.createElement("li")
        historyEl.textContent = searchHisArr[i];
        historyEl.classList.add("list-group-item");
        historyEl.classList.add("bg-primary");
        historyEl.classList.add("text-light");
        historyEl.classList.add("btn");
        searchHis.appendChild(historyEl);
        historyEl.addEventListener("click", function(){
            resetTempUnit();
            getFromHistory(this.textContent);
        })

        
    }
}

function getWeather(lat, lon, doSave = true){
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
        // saves history only when it was valid input
        // only save if this function got triggered from search button not histories
        if(doSave){
            saveHistories();
        }
        // resets temperature unit
        resetTempUnit();

        // selectors to modify contents
        var currentWeatherDt = document.querySelector(".current-weather-date");
        var currentHumid = document.querySelector(".current-humidity-text");
        var currentWind = document.querySelector(".current-wind-text");
        var currentTemp = document.querySelector(".current-temp-text");
        var currentEmoji = document.querySelector(".current-emoji");
        var cityName = document.querySelector("#city-name");

        // convert unix time to actual time
        var realTime = dayjs.unix(data.dt).format("MMM-D, dddd");

        // set the contents of an element to corresponding data
        cityName.textContent = data.name;
        currentWeatherDt.textContent = realTime;
        currentHumid.textContent = data.main.humidity;
        currentWind.textContent = data.wind.speed;
        currentTemp.textContent = data.main.temp;
        currentEmoji.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
        

        console.log("current weather ", data);
    })
    
}

function getWeatherForecast(lat, lon){
    // triggered when the current weather gets activated
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
        console.log("DATA: ", data.list)
        var weatherDates = document.querySelectorAll(".weather-date");
        var emoji = document.querySelectorAll(".emoji");
        var winds = document.querySelectorAll(".wind-text");
        var humiditys = document.querySelectorAll(".humidity-text");
        var temperatures = document.querySelectorAll(".temp-text");
        // iterating through data.list to find right data
         
        var startIndex = 0;
        var currDay = dayjs().$D;
        for(var i = 0; i < data.list.length; i++){
            if (dayjs(data.list[i].dt_txt).$D > currDay) {
                startIndex = i;
                break;
                
            }
        }

        var dataTracker = startIndex;
        for(var i = 0; i < weatherDates.length; i++){
            weatherDates[i].textContent = dayjs(data.list[dataTracker].dt_txt).format("MMM-D, ddd");
            winds[i].textContent = data.list[dataTracker].wind.speed;
            humiditys[i].textContent = data.list[dataTracker].main.humidity;
            temperatures[i].textContent = data.list[dataTracker].main.temp;
            emoji[i].src = `https://openweathermap.org/img/wn/${data.list[dataTracker].weather[0].icon}.png`;
            // since every 8th index is the next day data
            dataTracker += 8;
        }
        // the user now loaded weather at least once
        didLoad = true;
        console.log("weather data: ", data.list);
    })
}

function convertToGeo(value = searchIn.value, doSave = true){
    // triggered when the user clicks on the search btn
    // gets the value from the user input
    // adds the value to the search history
    // checks if what user entered was empty or blank space (trim)
    // convert the user entered search input to longitude and latitude by using geo api
    // after getting the right data, call getWeather function with the acquired values => getWeather(lat, lon) 

    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=1&appid=6a9214a29813211a9333c8fd3faf05f4&units=metric`;
    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        
        console.log("geo data: ", data)
        
        var latitude = data[0].lat;
        var longitude = data[0].lon;
        // calls to get current weather
        getWeather(latitude, longitude, doSave);
        // calls to get weather forecast
        getWeatherForecast(latitude, longitude);
    })


}

function saveHistories(value = searchIn.value){
    // triggered after succesfully fulfilling fetching request
    // gets the value from user input and makes li element to store
    // append it to search history ul
    
    // add classes to element
    
    // append the created element
    
    // pushes search history to the array if they don't have it already
    if(!(searchHisArr.includes(value))){
        var history = document.createElement("li");
        history.textContent = searchIn.value;
        history.classList.add("list-group-item");
        history.classList.add("bg-primary");
        history.classList.add("text-light");
        history.classList.add("btn");
        searchHis.appendChild(history);
        searchHisArr.push(history.textContent);

        // adds event listener to it
        history.addEventListener("click", function(){
            // display that instead
            getFromHistory(this.textContent);
        })

        console.log("search history array", searchHisArr)
        // saves history to local storage
        localStorage.setItem("history", JSON.stringify(searchHisArr))
    }



}

function convertUnits(){
    // if the current unit is celsius, change to fahrenheit (if unitRef == 'C' or 'F')
    // if it's in fahrenheit, change to celsius
    // apply the changes to .temp-text and .temp-unit
    // selectors for forecasts
    let tempElem = document.querySelectorAll(".temp-text");

    // selectors for the letter C
    let charEl = document.querySelectorAll(".temp-unit");

    // selectors for current
    let currentTemp = document.querySelector(".current-temp-text")
    let currentTempConverted = parseFloat(currentTemp.textContent);

    // if current unit is C
    if(unitRef.textContent == 'C'){
        
        currentTempConverted = (currentTempConverted * (9/5)) + 32;
        currentTempConverted = Number(currentTempConverted.toFixed(2));
        currentTemp.textContent = currentTempConverted;

        for(var i = 0; i < tempElem.length; i ++){
            // celsius to fahrenheit
            // parse to actual number
            let celNumConverted = parseFloat(tempElem[i].textContent)
            // conversion
            celNumConverted = (celNumConverted * (9/5)) + 32;
            // round to 100th 
            celNumConverted = Number(celNumConverted.toFixed(2));
            // push to text content
            tempElem[i].textContent = celNumConverted;
        }

        // changes C to F
        for(var i = 0; i < charEl.length; i ++){
            charEl[i].textContent = "F";
        }
        
    // if the unit is currently F
    } else {
        currentTempConverted = (currentTempConverted - 32) * (5/9);
        currentTempConverted = Number(currentTempConverted.toFixed(2));
        currentTemp.textContent = currentTempConverted;

        for(var i = 0; i < tempElem.length; i++){
            let farNumconverted = parseFloat(tempElem[i].textContent)
            farNumconverted = (farNumconverted - 32) * (5/9);
            farNumconverted = Number(farNumconverted.toFixed(2));
            tempElem[i].textContent = farNumconverted;
        }

        for(var i = 0; i < charEl.length; i++){
            charEl[i].textContent = "C";
        }
    }
}

function getFromHistory(value){
    // triggered when the user clicks on one of the search histories
    // passes the this.value to convertToGeo
    convertToGeo(value, false);
}

function resetTempUnit(){
    // change all the temp units back to C
    var charEl = document.querySelectorAll(".temp-unit");
    for(var i = 0; i < charEl.length; i ++){
        charEl[i].textContent = "C";
    }
}


// on click, call convertToGeo and saves histories
searchBtn.addEventListener("click", function(){
    convertToGeo()
})

// user clicks clear button
clearBtn.addEventListener("click", function(){
    // clears local storage
    localStorage.clear();

    // removes elements
    var listEl = document.querySelectorAll(".list-group-item");
    for(var i = 0; i < listEl.length; i++){
        listEl[i].remove();
    }
})

// to convert celcius to farenheight
convertBtn.addEventListener("click", function(){
    // if the user has loaded weather at least once=
    if(didLoad){
        convertUnits();
    }
})

