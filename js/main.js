console.log('main.js loaded');

// http://api.openweathermap.org/data/2.5/weather?q=London

$(document).ready(function() {
  var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?';
  var apiKey = '9f7fe3b0ceb0a7cf1e86812469152bc0';
  var weekday = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  var d = new Date();

  //using custom fonts instead of weather images

  var dict = {
    '01d': 'wi-day-sunny',
    '02d': 'wi-day-cloudy',
    '03d': 'wi-cloud',
    '04d': 'wi-cloudy',
    '09d': 'wi-showers',
    '10d': 'wi-day-rain-mix',
    '11d': 'wi-thunderstorm',
    '13d': 'wi-snow',
    '50d': 'wi-fog',
    '01n': 'wi-night-clear',
    '02n': 'wi-night-alt-cloudy',
    '03n': 'wi-night-alt-cloudy-high',
    '04n': 'wi-cloudy',
    '09n': 'wi-night-alt-sprinkle',
    '10n': 'wi-night-alt-showers',
    '11n': 'wi-night-alt-thunderstorm',
    '13n': 'wi-night-alt-snow',
    '50n': 'wi-night-fog'
  };


  function getWeatherData(city) {
    var getWeather = $.ajax({
      url: apiUrl,
      type: 'GET',
      dataType: 'json',
      data: {
        q: city,
        appid: apiKey
      }
    });

    getWeather.done(function(response) {
      console.log('response', response);
      var city = (response.name).toUpperCase();
      var temperature = Math.round(response.main.temp * 9 / 5 - 459.67);
      var humidity = response.main.humidity;
      var description = response.weather[0].description;
      var flag = (response.sys.country).toLowerCase();
      var icon = dict[response.weather[0].icon];
      // replaced picture with weather fonts
      // var weatherIcon = 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png';

      console.log(dict[response.weather[0].icon]);

      // put API response on the page
      $('.results .results-city').text(city);
      $('.temperature-container .temperature').text(temperature + 'º');
      $('#wi').attr('class', '');
      $('#wi').addClass('wi');
      $('#wi').addClass(icon);


    });


    getWeather.fail(function(error) {
      $('.city-error').css('display', 'block');
    });

  }

  //5 day forecast

  function forecast(location) {
    $.ajax({
      dataType: 'json',
      url: 'http://api.openweathermap.org/data/2.5/forecast/daily',
      data: {
        q: location,
        units: 'imperial',
        appid: apiKey,
        cnt: '5'
      }
    }).done(function(response) {
      console.log('response2', response);
      $('.forecast').empty();
      var dayCounter = d.getDay();
      for (i = 0; i <= 4; i++) {
        if (dayCounter >= weekday.length - 1) {
          dayCounter = 0
        } else {
          dayCounter += 1
        }

        var arr = [];
        var length = response.list.length;

        arr[i] = ("<div class='row'><h4 class='col-md-4' id='days'>" + weekday[dayCounter] + "<h4/><h4 class='col-md-4' id='max'>" + Math.round(response.list[i].temp.max) + 'º' + "</h4><h3 class='col-md-4' id='wi'></h3></div>");

        // min temp above
        // <h5 id='min'>" + Math.round(response.list[i].temp.min) + 'º' + "</h5>

        $('.forecast').append(arr.join(' '));
      }
    });
  }


  function setHandlers() {
    $('.getWeatherData').on('submit', function(e) {
      e.preventDefault();
      var city = $(this).find('.weather-city').val();
      getWeatherData(city);
    });
  }


  // flow of our web app
  function main() {
    getWeatherData('Austin');
    setHandlers();
    forecast('Austin');
  }
  main();

});
