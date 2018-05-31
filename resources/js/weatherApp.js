var outputLocation = document.querySelector(".output-location"),
    outputTemp = document.querySelector(".output-temp"),
    tempFormat = document.querySelector(".temp-format"),
    btnCelcius = document.querySelector(".celcius"),
    btnFarenheit = document.querySelector(".farenheit"),
    minTemp = document.querySelector("#min-temp");
    maxTemp = document.querySelector("#max-temp");
    classFar = document.querySelector(".far");
    classCel = document.querySelector(".cel");
    mphKph = document.querySelector(".mph-kph");
    outputDesc = document.querySelector(".output-desc"),
    outputMaxTemp = document.querySelector(".output-max-temp"),
    outputMinTemp = document.querySelector(".output-min-temp"),
    outputWind = document.querySelector(".output-wind"),
    outputHumidity = document.querySelector(".output-humidity"),
    outputSunrise = document.querySelector(".output-sunrise"),
    outputSunset = document.querySelector(".output-sunset"),
    btnInput = document.querySelector(".btn-input"),
    myLocation = document.querySelector(".my-location"),
    userLocInput = document.querySelector(".user-location-input").value,
    clearSky = document.querySelector("#clearsky"),
    fewClouds = document.querySelector("#few-clouds"),
    clouds = document.querySelector("#clouds"),
    rain = document.querySelector("#rain"),
    storm = document.querySelector("#storm"),
    snow = document.querySelector("#snow"),
    nightClearSky = document.querySelector("#night-clearsky"),
    nightClouds = document.querySelector("#night-clouds"),
    wind = document.querySelector("#wind"),
    mist = document.querySelector("#mist");
 

init();

// USER MANUAL LOCATION INPUT BUTTON
btnInput.addEventListener("click", function() {
	userLocInput = document.querySelector(".user-location-input").value;
    userInput();
});

// KEYPRESS EVENT WHEN USER ENTERS LOCATION INPUT
document.addEventListener("keypress", function(event) {
	if (event.keyCode === 13 || event.which === 13) {
		userLocInput = document.querySelector(".user-location-input").value;
	    userInput();
	    document.querySelector(".user-location-input").value = "";
	}
});

// USE MY LOCATION BUTTON
myLocation.addEventListener("click", function() {
    inputLocation();
});

// CONVERT TO IMPERIAL BUTTON
btnFarenheit.addEventListener("click", function() {
    toImperial();
});

// CONVERT TO METRIC BUTTON
btnCelcius.addEventListener("click", function() {
	toMetric();
});


function inputLocation() {
	// GET USER'S LOCATION BY LAT. AND LONG.
    navigator.geolocation.getCurrentPosition(function(position) {
		var lat = position.coords.latitude;
		var long = position.coords.longitude;
		// USE USER'S LAT. AND LONG. INSIDE THE API
		var myRequest = new XMLHttpRequest();
		myRequest.open("GET", "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=imperial&appid=34fb6e34f6b56c480b19f84502d25032");

		myRequest.onload = function() {
			var myData = JSON.parse(myRequest.responseText);
			renderWeather(myData);
			renderDates(myData);
			iconDisplay(myData);
			
            // CONVERT TO IMPERIAL BY DEFAULT
			tempFormat.textContent = "F";
            btnFarenheit.classList.add("selected");
            btnCelcius.classList.remove("selected");

            mphKph.textContent = "mph";
		}

		myRequest.send();
	});
}

function userInput() {
	// GET USER'S CITY INPUT AND USE INSIDE THE API
    var myRequest = new XMLHttpRequest();
	myRequest.open("GET", "https://api.openweathermap.org/data/2.5/weather?q=" + userLocInput + "&units=imperial&appid=34fb6e34f6b56c480b19f84502d25032");

	myRequest.onload = function() {
		var myData = JSON.parse(myRequest.responseText);
		renderWeather(myData);
		iconDisplay(myData);
		
        // GET LAT. AND LONG. FROM THE CURRENT WEATHER API AND USE IN GOOGLE API
		var lat = myData.coord.lat;
		var long = myData.coord.lon;
		var geoRequest = new XMLHttpRequest();
		geoRequest.open("GET", "https://maps.googleapis.com/maps/api/timezone/json?location=" + lat + "," + long + "&timestamp=1331161200&key=AIzaSyAraYpKJY-RQjtaXMfEuXED_AJBsSJqCEA");

	    geoRequest.onload = function() {
	    	var geoData = JSON.parse(geoRequest.responseText);
	    	console.log(geoData);
	    	
            // GET TIME ZONE ID FROM GOOGLE'S API TO DETERMINE USER'S TIMEZONE
	    	var timeZoneId = geoData.timeZoneId;
	    	// DETERMINE REALATIVE SUNRISE AND SUNSET TIMES
	    	var sunrise = new Date(1000 * myData.sys.sunrise);
			var sunset = new Date(1000 * myData.sys.sunset);
			var sunrisestr = sunrise.toUTCString();
			var sunsetstr = sunset.toUTCString();
			var offsetSunrise = moment.tz(sunrisestr, timeZoneId);
			var localSunrise = offsetSunrise.format("HH:mm");
			var offsetSunset = moment.tz(sunsetstr, timeZoneId);
			var localSunset = offsetSunset.format("HH:mm");

            outputSunrise.textContent = localSunrise;
            outputSunset.textContent = localSunset;

            // SET IMPERIAL BY DEFAULT
            tempFormat.textContent = "F";
            btnFarenheit.classList.add("selected");
            btnCelcius.classList.remove("selected");

            mphKph.textContent = "mph";

	    }
	    geoRequest.send();
	}
	myRequest.send();
}

// DISPLAY MAIN WEATHER DATA
function renderWeather(data) {
	outputLocation.textContent = data.name + ", " + data.sys.country;
	outputTemp.textContent = Math.round(data.main.temp);
	outputDesc.textContent = " " + data.weather[0].description;
	outputMaxTemp.textContent = " " + Math.round(data.main.temp_max);
	outputMinTemp.textContent = " " + Math.round(data.main.temp_min);
	outputWind.textContent = Math.round(data.wind.speed);
	outputHumidity.textContent = data.main.humidity;
   
}

// DISPLAY LOCAL SUNRISE AND SUNSET TIMES
function renderDates(data) {
	var sunrise = new Date(1000 * data.sys.sunrise);
	var sunset = new Date(1000 * data.sys.sunset);

    outputSunrise.textContent = moment(sunrise).format("HH:mm");
    outputSunset.textContent =  moment(sunset).format("HH:mm");
	
}

// CHANGE WEATHER ICON ACCORDING TO CURRENT WEATHER ID
function iconDisplay(data) {
	var dayOrNight;
	var time = Date.now().toString();
	var curTimeStr = time.slice(0, time.length - 3);
	var curTime = parseFloat(curTimeStr);
	var sunset = data.sys.sunset;
	var sunrise = data.sys.sunrise;
	if (curTime >= sunrise && curTime <= sunset) {
		dayOrNight = true;
	} else {
		dayOrNight = false;
	}

	if (dayOrNight && data.weather[0].id === 800) {
		clearSky.style.display = "inline";
		nightClearSky.style.display = "none";
		nightClouds.style.display = "none";
		rain.style.display = "none";
		storm.style.display = "none";
		snow.style.display = "none";
		clouds.style.display = "none";
		fewClouds.style.display = "none";
		wind.style.display = "none";
		mist.style.display = "none";
	} else if (!dayOrNight && data.weather[0].id === 800) {
		clearSky.style.display = "none";
		nightClearSky.style.display = "inline";
		nightClouds.style.display = "none";
		rain.style.display = "none";
		storm.style.display = "none";
		snow.style.display = "none";
		clouds.style.display = "none";
		fewClouds.style.display = "none";
		wind.style.display = "none";
		mist.style.display = "none";
	} else if (!dayOrNight && data.weather[0].id >= 801 &&data.weather[0].id <= 804) {
	    clearSky.style.display = "none";
		nightClearSky.style.display = "none";
		nightClouds.style.display = "inline";
		rain.style.display = "none";
		storm.style.display = "none";
		snow.style.display = "none";
		clouds.style.display = "none";
		fewClouds.style.display = "none";
		wind.style.display = "none";
		mist.style.display = "none";
	} else if (data.weather[0].id >= 300 && data.weather[0].id <= 531) {
		clearSky.style.display = "none";
		nightClearSky.style.display = "none";
		nightClouds.style.display = "none";
		rain.style.display = "inline";
		storm.style.display = "none";
		snow.style.display = "none";
		clouds.style.display = "none";
		fewClouds.style.display = "none";
		wind.style.display = "none";
		mist.style.display = "none";
	} else if (data.weather[0].id >= 200 && data.weather[0].id <= 232 || data.weather[0].id === 901 || data.weather[0].id === 900 || data.weather[0].id === 960 || data.weather[0].id === 961 || data.weather[0].id === 962 ) {
		clearSky.style.display = "none";
		nightClearSky.style.display = "none";
		nightClouds.style.display = "none";
		rain.style.display = "none";
		storm.style.display = "inline";
		snow.style.display = "none";
		clouds.style.display = "none";
		fewClouds.style.display = "none";
		wind.style.display = "none";
		mist.style.display = "none";
	} else if (data.weather[0].id >= 600 && data.weather[0].id <= 622) {
		clearSky.style.display = "none";
		nightClearSky.style.display = "none";
		nightClouds.style.display = "none";
		rain.style.display = "none";
		storm.style.display = "none";
		snow.style.display = "inline";
		clouds.style.display = "none";
		fewClouds.style.display = "none";
		wind.style.display = "none";
		mist.style.display = "none";
	} else if (data.weather[0].id >= 802 && data.weather[0].id <= 804) {
		clearSky.style.display = "none";
		nightClearSky.style.display = "none";
		nightClouds.style.display = "none";
		rain.style.display = "none";
		storm.style.display = "none";
		snow.style.display = "none";
		clouds.style.display = "inline";
		fewClouds.style.display = "none";
		wind.style.display = "none";
		mist.style.display = "none";
	} else if (data.weather[0].id === 801) {
		clearSky.style.display = "none";
		nightClearSky.style.display = "none";
		nightClouds.style.display = "none";
		rain.style.display = "none";
		storm.style.display = "none";
		snow.style.display = "none";
		clouds.style.display = "none";
		fewClouds.style.display = "inline";
		wind.style.display = "none";
		mist.style.display = "none";
	}  else if (data.weather[0].id === 905 || data.weather[0].id === 902 || (data.weather[0].id >= 952 && data.weather[0].id <= 959)) {
		clearSky.style.display = "none";
		nightClearSky.style.display = "none";
		nightClouds.style.display = "none";
		rain.style.display = "none";
		storm.style.display = "none";
		snow.style.display = "none";
		clouds.style.display = "none";
		fewClouds.style.display = "none";
		wind.style.display = "inline";
		mist.style.display = "none";
	} else if (data.weather[0].id >= 700 && data.weather[0].id <= 781) {
        clearSky.style.display = "none";
		nightClearSky.style.display = "none";
		nightClouds.style.display = "none";
		rain.style.display = "none";
		storm.style.display = "none";
		snow.style.display = "none";
		clouds.style.display = "none";
		fewClouds.style.display = "none";
		wind.style.display = "none";
		mist.style.display = "inline";
	} else {
		console.log("other");
	}
}

function init() {
	inputLocation();
	clearSky.style.display = "none";
	nightClearSky.style.display = "none";
	nightClouds.style.display = "none";
	rain.style.display = "none";
	storm.style.display = "none";
	snow.style.display = "none";
	clouds.style.display = "none";
	wind.style.display = "none";
	mist.style.display = "none";
	fewClouds.style.display = "none";
	tempFormat.textContent = "F";
	btnFarenheit.classList.add("selected");
	minTemp.classList.add("far");
	minTemp.classList.remove("cel");
	maxTemp.classList.add("far");
	maxTemp.classList.remove("cel");
	mphKph.textContent = "mph";

}

function toImperial() {
	if (tempFormat.textContent === "C" && classCel) {
    	tempFormat.textContent = "F";
    	mphKph.textContent = "mph";
        btnFarenheit.classList.toggle("selected");
        btnCelcius.classList.toggle("selected");
    	maxTemp.classList.toggle("cel");
    	minTemp.classList.toggle("cel");
    	parseFloat(outputTemp.textContent);
    	parseFloat(outputMaxTemp.textContent);
    	parseFloat(outputMinTemp.textContent);
    	parseFloat(outputWind.textContent);
    	outputTemp.textContent = Math.round((outputTemp.textContent * 9) / 5 + 32);
    	outputMaxTemp.textContent = " " + Math.round((outputMaxTemp.textContent * 9) / 5 + 32);
    	outputMinTemp.textContent = " " + Math.round((outputMinTemp.textContent * 9) / 5 + 32);
    	outputWind.textContent = Math.round(outputWind.textContent / 1.60934);
    }
}

function toMetric() {
	if (tempFormat.textContent === "F" && classFar) {
    	tempFormat.textContent = "C";
    	mphKph.textContent = "kph";
    	btnFarenheit.classList.toggle("selected");
        btnCelcius.classList.toggle("selected");
    	maxTemp.classList.toggle("far");
    	minTemp.classList.toggle("far");
    	parseFloat(outputTemp.textContent);
    	parseFloat(outputMaxTemp.textContent);
    	parseFloat(outputMinTemp.textContent);
    	parseFloat(outputWind.textContent);
    	outputTemp.textContent = Math.round(((outputTemp.textContent - 32) * 5) / 9);
    	outputMaxTemp.textContent = " " + Math.round(((outputMaxTemp.textContent - 32) * 5) / 9);
    	outputMinTemp.textContent = " " + Math.round(((outputMinTemp.textContent - 32) * 5) / 9);
    	outputWind.textContent = Math.round(outputWind.textContent * 1.60934);
    }
}


