$(document).ready(function() {

//GLOBAL VARIABLES
let APIKey = "166a433c57516f51dfab1f7edaed8413";
let cityButtons = $(".city-buttons");
let forecastDiv = $(".forecast-div");
let forecastTitle = $("#forecast-title");

getHistoryButton();

//Dynamically creates search history buttons basded on my previous searches.
function getHistoryButton() {
    $(".city-buttons").empty();
   let previousSearches = JSON.parse((localStorage.getItem("Cities"))) || [];
    //console.log(previousSearches);
    for (i = 0; i < previousSearches.length; i++){
       let button = $("<button>" + previousSearches[i] + "</button>");
       $(".city-buttons").append(button);
 }
}

//Uses an ajax call to get info about a specific city
function displayCityInfo() { 
let city = $("#search-input").val().trim();
//console.log(city);
let queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q="+ city + "&units=imperial&appid=" + APIKey; 
$.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {
      //console.log(response);
      let currentCity = $("#current-city");
      let temp = $("#temp");
      let humidity = $("#humidity");
      let wind = $("#wind");
      let latitude = response.coord.lat
      let longitude = response.coord.lon

      currentCity.text(response.name);
      temp.text("Temp(f): " + response.main.temp);
      humidity.text("Humidity(%): " + response.main.humidity);
      wind.text("Wind Speed(MPH): " + response.wind.speed);

      displayDate(currentCity);
      displayIcon(currentCity, response);
      getUv(latitude, longitude);
      displayFiveDay(latitude, longitude);
      saveLocal(city);
      getHistoryButton();
    });
}


function saveLocal(city){
    let cities = JSON.parse((localStorage.getItem("Cities"))) || [];
    cities.unshift(city);
    if (cities.length > 8) {
        cities.pop();
    }
    localStorage.setItem("Cities", JSON.stringify(cities));
    //console.log(cities);
}

 
function getUv(latitude, longitude) {
    let queryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${latitude}&lon=${longitude}`   
    $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function(response) {
        let uvIndex = $("#uv");
        uvIndex.text("UV Index: " + response.value)
    });
};

function historyBtnClick(event) {
    console.log(event.target.innerHTML);
    city = event.target.innerHTML;
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q="+ city + "&units=imperial&appid=" + APIKey; 
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
        //console.log(response);
        let currentCity = $("#current-city");
        let temp = $("#temp");
        let humidity = $("#humidity");
        let wind = $("#wind");
        let latitude = response.coord.lat
        let longitude = response.coord.lon
        
        currentCity.text(response.name);
        temp.text("Temp: " + response.main.temp + String.fromCharCode(176) + " F");
        humidity.text("Humidity: " + response.main.humidity + "%");
        wind.text("Wind Speed: " + response.wind.speed + " MPH");

        getUv(latitude, longitude);
        displayDate(currentCity);
        displayIcon(currentCity, response);
        displayFiveDay(latitude, longitude);
        });

}

function displayDate(currentCity) {
    let timeStamp = moment().format('L');
    currentCity.append(" " + "(" + timeStamp + ")");
    };

function displayIcon (currentCity, response) {
    let iconCode = response.weather[0].icon;
    let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    //console.log(iconUrl);
    let iconImg = $('<img>').attr("src", iconUrl);
    console.log(iconImg);
    currentCity.append(iconImg);

}

function displayFiveDay(latitude, longitude) {
    forecastDiv.empty();
    forecastTitle.text("5-Day Forecast: ");
    let queryURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=imperial`
    $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function(response) {
        console.log(response);
        for (let i = 4; i <= 36; i += 8) {
            let forecastCard = $("<div>").attr("class", "forecast-card");
            let forecastDate = $("<h3>").attr("id", "forecast-date");
            let forecastTemp = $("<p>").attr("id", "forecast-temp");
            let forecastHum = $("<p>").attr("id", "forecast-hum");
            let iconCode = response.list[i].weather[0].icon;
            let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            let forecastIcon = $("<img>").attr("src", iconUrl);

            let timeCode = response.list[i].dt;
            momentDate = moment.unix(timeCode).utc().format("MM/DD/YYYY");
            forecastDate.text(momentDate);
            forecastTemp.text("Temp: " + response.list[i].main.temp + String.fromCharCode(176) + " F");
            forecastHum.text("Humidity: " + response.list[i].main.humidity + "%");


            forecastDiv.append(forecastCard);
            forecastCard.append(forecastDate);
            forecastCard.append(forecastIcon);
            forecastCard.append(forecastTemp);
            forecastCard.append(forecastHum);
        }
        
    });

}

$(document).on("click", "#search-button", function(){
    displayCityInfo();
    
});

$(cityButtons).on("click", historyBtnClick);

});