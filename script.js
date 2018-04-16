function formatDate(date) {
    // 10-digit UTC formats, multiply by 1000 because need in milliseconds (not seconds)
    var hours = date.getHours();    
    var ampm = hours >= 12 ? 'pm' : 'am';   
    // convert from military to 12 hour format by getting remainder
    hours = hours % 12;
    hours = hours ? hours : 12; // if the remainder hour is '0' should be '12'  
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes; // if minutes less than 10 put a zero in front
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
function windDirection(windDeg){
    let direction = "";
    if(windDeg>=11.25 && windDeg <33.75){direction ="NNE";}
    else if(windDeg>=33.75 && windDeg <56.25){direction ="NE";}
    else if(windDeg<78.75){direction ="ENE";}
    else if(windDeg<101.25){direction ="E";}
    else if(windDeg<123.75){direction ="ESE";}
    else if(windDeg<146.25){direction ="SE";}
    else if(windDeg<168.75){direction ="SSE";}
    else if(windDeg<191.25){direction ="S";}
    else if(windDeg<213.75){direction ="SSW";}
    else if(windDeg<236.25){direction ="SW";}
    else if(windDeg<258.75){direction ="WSW";}
    else if(windDeg<281.25){direction ="W";}
    else if(windDeg<303.75){direction ="WNW";}
    else if(windDeg<326.25){direction ="NW";}
    else if(windDeg<326.25){direction ="NNW";}
    else{direction ="N";}
    return direction;
}

function showWeather(results){
    let htmlStr = `
        <h1>${results.name}</h1>
        <h5>as of ${formatDate(new Date())}</h5>
        <div>
            <img src='${"http://openweathermap.org/img/w/" + results.weather[0].icon + ".png"}'>
            <h2>${Number.parseFloat(results.main.temp).toFixed(0)}&deg F</h2>
            <p id='desc'>${results.weather[0].description}</p>
        </div>
        <ul>
            <li>Humidity: <span>${results.main.humidity}%</span></li>
            <li>Barometric Pressure: <span>${Number.parseFloat(results.main.pressure/33.863886666667).toFixed(2)} in</span></li>
            <li>Cloud Cover: <span>${results.clouds.all}%</span></li>
            <li>Winds: <span>${Number.parseFloat(results.wind.speed).toFixed(0)} mph ${windDirection(results.wind.deg)}</span></li>
        </ul>
        <p>Sunrise <span>${formatDate(new Date((results.sys.sunrise)*1000))}</span></p>
        <p>Sunset <span>${formatDate(new Date((results.sys.sunset)*1000))}</span></p>  
    `;
    $("#weather-report").html(htmlStr);
    window.localStorage.setItem('myWeather', htmlStr)
    window.localStorage.setItem('timeReq', formatDate(new Date()))
}

$(document).ready(function(){
    if(window.localStorage.length == 0){ //user has not visited page before
        $("form").before("<h3>Welcome to the WeatherApp!</h3>")
    } else{
        $("form").before(`<h3>Welcome back!</h3><h4 class="old-weather">last weather report requested at ${window.localStorage.getItem("timeReq")}.</h4>`);
        $("#weather-report").html(window.localStorage.getItem("myWeather"));
    }
    $("form").submit(function(event){
        event.preventDefault();
        //remove old weather report
        $(".old-weather").remove();
        //variables for URL construction
        let baseURL = "http://api.openweathermap.org/data/2.5/weather?q=";
        let params = $("#city").val() + "&units=imperial&APPID=62d4f3416197c4cb81ec998da8c52aa1";
        let errorMsg = `
            <p class="text-danger">Oops, something went wrong with this request. If the URL is correct, there could be an issue with the server. Please try again at a later time.</p>
        `;

        //create a promise for get (weather) request
        var getTheWeather = Promise.resolve($.getJSON(baseURL+params));
        getTheWeather.then(function(response){
            console.log(new Date())
            showWeather(response);
        }).catch(function(jqXHR){
            $("#weather-report").html(errorMsg);
        });
    });
});