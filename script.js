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
    var direction = "";
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
$(document).ready(function(){
    $("form").submit(function(event){
        event.preventDefault();
        //variables for URL construction
        var baseURL = "http://api.openweathermap.org/data/2.5/weather?q=";
        var params = $("input[name='search-city']").val() + "&units=imperial&APPID=62d4f3416197c4cb81ec998da8c52aa1";
        $.get(baseURL + params, function(data){
            // variables for converting JSON data received
            var windDir = windDirection(data.wind.deg);
            var sunset = formatDate(new Date((data.sys.sunset)*1000));
            var sunrise = formatDate(new Date((data.sys.sunrise)*1000));
            var baroPressure = Number.parseFloat(data.main.pressure/33.863886666667).toFixed(2);
            var temperature = Number.parseFloat(data.main.temp).toFixed(0);
            var iconURL = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
            var htmlStr = `
                <h1>${data.name}</h1>
                <div>
                    <img src='${iconURL}'>
                    <h2>${temperature}&deg F</h2>
                    <p id='desc'>${data.weather[0].description}</p>
                </div>
                <ul>
                    <li>Humidity: <span>${data.main.humidity}%</span></li>
                    <li>Barometric Pressure: <span>${baroPressure}</span> in</li>
                    <li>Cloud Cover: <span>${data.clouds.all}%</span></li>
                </ul>
                <p>Sunrise <span>${sunrise}</span></p>
                <p>Sunset <span>${sunset}</span></p>  
            `;
            $("#weather-report").html(htmlStr);
            $("input[name='search-city']").val("");
        }, 'json');
    });
});