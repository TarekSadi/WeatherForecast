//Opens sidebar on clicking Menu
function openSidebar() {
    //If sidebar is hidden, display it
    $("#sidebar").animate({
        left: '0%'
    }, 500);
}

//Close sidebar
function closeSidebar() {
    $("#sidebar").animate({
        left: '-70%'
    }, 500);
}

//Opens Details
function openDetails() {
    detailsview.style.height = "100%";
}

//Close Details
function closeDetails() {
    detailsview.style.height = "0%";
}

//Day counter with alert function
var dayCount = 0;

//Set date
var currentDay = new Date();
//document.getElementById("date_set").innerHTML = currentDay.toDateString();
$("#date_set").html(currentDay.toDateString());

//Change date
function changeDate(currentDay, delta) {

    currentDay.setDate(currentDay.getDate() + delta);
    $("#date_set").html(currentDay.toDateString());

    //Day counter with disappearing buttons
    dayCount += delta;

    if (dayCount == 0) {
        $("#button_left").css('display', 'none');
        //document.getElementById("button_left").style.display = "none"; 
    } else {
        $("#button_left").css('display', 'block');
        //document.getElementById("button_left").style.display = "block"; 
    }

    if (dayCount == 6) {
        $("#button_right").css('display', 'none');
        //document.getElementById("button_right").style.display="none";   
    } else {
        $("#button_right").css('display', 'block');
    }
    //document.getElementById("button_right").style.display="block";
    updateContent();
}

//Fahrenheit to Celcius. Add onclick event to Fahrenheit Button in Sidebar
function convertFC() {
    var C = ((weather.daily.data[dayCount].temperatureMax) - 32) * 5 / 9; //Calculate Celcius from displayed Temperature T
    $("#mainview_temp").html(Math.round(C) + '°C');
    console.log(C); //Change value of temperature in weather object
}

//Celcius to Fahrenheit converter
function convertCF() {
    var F = weather.daily.data[dayCount].temperatureMax; //Calculate Celcius from displayed Temperature T
    $("#mainview_temp").html(Math.round(F) + '°F');
}

//Convert mph to km/h
function convertMK() {
    var K = (weather.daily.data[dayCount].windSpeed) * 1.6093;
    $("#mainview_wind").html(Math.round(K) + 'km/h');
}

function convertKM() {
    var M = (weather.daily.data[dayCount].windSpeed);
    $("#mainview_wind").html(Math.round(M) + 'mph');
}

//TO DO
$('#sidebar').hover(function () {
    $('#siebar').css("background-color", "#FFF");
});

//Update Mainview when clicking left or right
function updateContent() {
    var windspeed = Math.round(weather.daily.data[dayCount].windSpeed);
    var humidity = Math.round(weather.daily.data[dayCount].humidity * 100);
    $("#mainview_summary").html(weather.daily.data[dayCount].summary);
    $("#mainview_icon").attr('src', 'img/' + weather.daily.data[dayCount].icon + '.png');
    $("#mainview_temp").html(weather.daily.data[dayCount].temperatureMax + '°F');
    $("#mainview_wind").html(windspeed + ' m/h');
    $("#mainview_humidity").html(humidity + ' %');
};

//Change actual content
function changeContent() {
    var windspeed = Math.round(weather.currently.windSpeed);
    var humidity = Math.round(weather.currently.humidity * 100);
    $("#mainview_summary").html(weather.currently.summary);
    //document.getElementById("mainview_summary").innerHTML = weather.currently.summary;
    $("#mainview_icon").attr('src', 'img/' + weather.currently.icon + '.png');
    //document.getElementById("mainview_icon").src = "img/" + weather.currently.icon + ".png";
    $("#mainview_temp").html(weather.currently.temperature + '°F');
    //document.getElementById("mainview_temp").innerHTML = weather.currently.temperature +"°F";
    $("#mainview_wind").html(windspeed + 'm/h');
    //document.getElementById("mainview_wind").innerHTML = weather.currently.windSpeed + "m/h";
    $("#mainview_humidity").html(humidity + '%');
    //document.getElementById("mainview_humidity").innerHTML = weather.currently.humidity;

    $.each(weather.hourly.data, function (index, value) {
        var detailsTime = new Date(weather.hourly.data[index].time * 1000).getHours() + ":00";
        //$("<div>").addClass("hour col-xs-2").text(weather.hourly.data[index].time + ":00");
        var detailsIcon = weather.hourly.data[index].icon;
        var detailsTemp = weather.hourly.data[index].temperature;
        var detailsWind = weather.hourly.data[index].windSpeed;
        var detailsHum = weather.hourly.data[index].humidity;

        var rowData = $("<td>" + detailsTime + "<td>" + "<img src = img/" + detailsIcon + ".png>" + "</td>" + "<td>" + detailsTemp + "</td><td>" + detailsWind + "</td><td>" + detailsHum + "</td>");
        var row = $("<tr>").append(rowData);
        $("row").addClass("table");

        $("#detailsviewTable").append(row);

    });
};

//get coordinates when clicking on
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

//Update Weather Info when locating with "locate-me"
function showPosition(position) {
    console.log(position.coords.latitude, position.coords.longitude);

    var url = "https://api.forecast.io/forecast/f9de33a7a23185feeff7af79b4e79c89/" + position.coords.latitude + "," + position.coords.longitude;

    displayLoadScreen();
    //Ajax call with updated coordinates
    $.ajax({
        url: url,
        crossDomain: true,
        dataType: 'jsonp'
    }).done(function (data) {
        weather = data;
        changeContent();
        loadScreen();
        console.log(weather);
    });
    //Reverse geocoding
    var url2 = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&key=AIzaSyBJIJgx9RT6J1o-Xd-roM0q7F4QXEzltns"
    $.ajax({
        url: url2,
        crossDomain: true,
        dataType: 'json'
    }).done(function (result) {
        var geolocation = result.results[0].address_components[2].short_name;
        $('#cityName').html(geolocation);
    });
}

$(function () {
    getLocation();

});

function loadScreen() {
        $("#loadScreen").fadeOut("slow");
}
function displayLoadScreen(){
        $("#loadScreen").fadeIn("fast");
}